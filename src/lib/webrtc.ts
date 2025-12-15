import { SignalingClient } from './signaling';
import { SignalingMessage } from './types';

export interface FileMetadata {
  fileId: string;
  name: string;
  size: number;
  type: string;
}

export interface TransferProgress {
  percent: number;
  bytesTransferred: number;
}

export enum SendState {
  Idle = 'Idle',
  Sending = 'Sending',
  WaitingAck = 'WaitingAck',
  Done = 'Done',
}

export enum ReceiveState {
  Idle = 'Idle',
  Receiving = 'Receiving',
  Done = 'Done',
}

interface DCMessage {
  type: 'transfer_started' | 'transfer_end' | 'ack';
  fileId?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
}

export class WebRTCFileTransfer {
  private pc: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  
  // Strict buffer limits
  private readonly MAX_BUFFER_SIZE = 4 * 1024 * 1024; // 4MB
  private readonly LOW_BUFFER_THRESHOLD = 2 * 1024 * 1024; // 2MB

  private signaling: SignalingClient;
  private iceServers: RTCConfiguration;
  
  // Callbacks
  private onProgress?: (progress: TransferProgress) => void;
  private onComplete?: () => void;
  private onError?: (error: string) => void;
  private onDataChannelOpen?: () => void;
  private onFileReceived?: (file: File, metadata: FileMetadata) => void;

  // Receiver State
  private fileMetadata: { totalSize: number; fileName: string; fileType: string; fileId: string } | null = null;
  private activeTransferBuffer: Uint8Array | null = null; // Pre-allocated buffer
  private receivedBytes: number = 0;
  private isTransferEndReceived: boolean = false;
  
  // State Machine
  private sendState: SendState = SendState.Idle;
  private receiveState: ReceiveState = ReceiveState.Idle;
  
  private isCleaningUp: boolean = false;

  constructor(
    signaling: SignalingClient,
    iceServers: RTCConfiguration,
    callbacks?: {
      onProgress?: (progress: TransferProgress) => void;
      onComplete?: () => void;
      onError?: (error: string) => void;
      onDataChannelOpen?: () => void;
    }
  ) {
    this.signaling = signaling;
    this.iceServers = iceServers;
    this.onProgress = callbacks?.onProgress;
    this.onComplete = callbacks?.onComplete;
    this.onError = callbacks?.onError;
    this.onDataChannelOpen = callbacks?.onDataChannelOpen;

    this.setupSignalingHandlers();
  }

  private setupSignalingHandlers(): void {
    // Signaling is ONLY for connection establishment, NOT for transfer control.
    this.signaling.on('offer', (msg) => {
      this.handleOffer(msg.sdp);
    });

    this.signaling.on('answer', (msg) => {
      this.handleAnswer(msg.sdp);
    });

    this.signaling.on('ice_candidate', (msg) => {
      this.handleIceCandidate(msg);
    });

    this.signaling.on('peer_disconnected', () => {
      this.cleanup();
    });
  }

  // ==============================================================================
  // CONNECTION SETUP
  // ==============================================================================

  async initializeAsSender(): Promise<void> {
    this.pc = new RTCPeerConnection(this.iceServers);

    // Create data channel
    this.dataChannel = this.pc.createDataChannel('fileTransfer', {
      ordered: true,
    });
    
    // ENFORCE Threshold immediately
    this.dataChannel.bufferedAmountLowThreshold = this.LOW_BUFFER_THRESHOLD;

    this.setupDataChannel(this.dataChannel);

    // Handle ICE
    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.signaling.send({
          type: 'ice_candidate',
          candidate: event.candidate.candidate,
          sdp_mid: event.candidate.sdpMid || undefined,
          sdp_mline_index: event.candidate.sdpMLineIndex || undefined,
        });
      }
    };

    // Create Offer
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    this.signaling.send({
      type: 'offer',
      sdp: offer.sdp || '',
    });
  }

  async initializeAsReceiver(): Promise<void> {
    this.pc = new RTCPeerConnection(this.iceServers);

    // Handle incoming data channel
    this.pc.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      // ENFORCE Threshold
      this.dataChannel.bufferedAmountLowThreshold = this.LOW_BUFFER_THRESHOLD;
      this.setupDataChannel(this.dataChannel);
    };

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.signaling.send({
          type: 'ice_candidate',
          candidate: event.candidate.candidate,
          sdp_mid: event.candidate.sdpMid || undefined,
          sdp_mline_index: event.candidate.sdpMLineIndex || undefined,
        });
      }
    };
  }

  private async handleOffer(sdp: string): Promise<void> {
    if (!this.pc) {
      await this.initializeAsReceiver();
    }
    if (!this.pc) return;

    await this.pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp }));
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);

    this.signaling.send({
      type: 'answer',
      sdp: answer.sdp || '',
    });
  }

  private async handleAnswer(sdp: string): Promise<void> {
    if (!this.pc) return;
    await this.pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));
  }

  private async handleIceCandidate(msg: SignalingMessage & { type: 'ice_candidate' }): Promise<void> {
    if (!this.pc) return;
    const candidate = new RTCIceCandidate({
      candidate: msg.candidate,
      sdpMid: msg.sdp_mid || null,
      sdpMLineIndex: msg.sdp_mline_index || null,
    });
    await this.pc.addIceCandidate(candidate);
  }

  private setupDataChannel(channel: RTCDataChannel): void {
    channel.onopen = () => {
      this.onDataChannelOpen?.();
    };

    channel.onerror = (error) => {
      if (!this.isCleaningUp && this.sendState !== SendState.Done && this.receiveState !== ReceiveState.Done) {
        this.onError?.('Data channel error');
      }
    };

    if (this.onFileReceived) {
      this.setupFileReceptionHandlers(channel);
    }
  }

  // ==============================================================================
  // SENDER LOGIC
  // ==============================================================================

  async sendFile(file: File): Promise<void> {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      throw new Error('Data channel is not open');
    }

    // 1. Generate ID and reset state
    const fileId = crypto.randomUUID();
    this.sendState = SendState.Sending;

    // Starting transfer

    // 2. Send Metadata via DataChannel
    const metaMsg: DCMessage = {
      type: 'transfer_started',
      fileId: fileId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
    };
    this.dataChannel.send(JSON.stringify(metaMsg));

    const CHUNK_SIZE = 16 * 1024; // 16KB
    let offset = 0;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      let ackTimeout: ReturnType<typeof setTimeout>;

      const cleanup = () => {
        this.dataChannel?.removeEventListener('error', onError);
        this.dataChannel?.removeEventListener('close', onClose);
        this.dataChannel?.removeEventListener('message', onMessage);
        
        if (ackTimeout) {
            clearTimeout(ackTimeout);
        }
      };

      const onError = (e: Event) => {
        const err = e instanceof ErrorEvent ? e.error : new Error('DataChannel Error');
        cleanup();
        reject(err);
      };

      const onClose = () => {
        cleanup();
        reject(new Error('DataChannel closed unexpectedly'));
      };

      // 4. Handle ACK
      const onMessage = (event: MessageEvent) => {
        if (typeof event.data !== 'string') return;
        try {
          const msg = JSON.parse(event.data) as DCMessage;
          if (msg.type === 'ack' && msg.fileId === fileId) {
             // Received ACK. Transfer complete.
             this.sendState = SendState.Done;
             cleanup();
             this.onComplete?.();
             resolve();
          }
        } catch (e) {
          // Bad message ignored
        }
      };

      this.dataChannel?.addEventListener('error', onError);
      this.dataChannel?.addEventListener('close', onClose);
      this.dataChannel?.addEventListener('message', onMessage);

      // 3. Send Loop with Backpressure
      const readAndSend = () => {
        if (this.sendState !== SendState.Sending) return;

        const slice = file.slice(offset, offset + CHUNK_SIZE);
        reader.readAsArrayBuffer(slice);
      };

      reader.onload = (e) => {
        if (!e.target?.result || !this.dataChannel) {
          cleanup();
          reject(new Error('Read failed or channel lost'));
          return;
        }

        const chunk = e.target.result as ArrayBuffer;
        
        try {
          this.dataChannel.send(chunk);
          offset += chunk.byteLength;

          // Progress
          const percent = (offset / file.size) * 100;
          this.onProgress?.({ percent, bytesTransferred: offset });

          if (offset < file.size) {
            // Check buffer
            if (this.dataChannel.bufferedAmount > this.MAX_BUFFER_SIZE) {
               // Wait for bufferedamountlow
               const onLow = () => {
                  this.dataChannel?.removeEventListener('bufferedamountlow', onLow);
                  readAndSend();
               };
               this.dataChannel.addEventListener('bufferedamountlow', onLow);
            } else {
               // Keep going
               readAndSend();
            }
          } else {
            // File sent. Send End.
            // File sent. Sending transfer_end
            const endMsg: DCMessage = { type: 'transfer_end', fileId };
            this.dataChannel.send(JSON.stringify(endMsg));
            
            this.sendState = SendState.WaitingAck;
            // Waiting for ACK

            // ACK Timeout
            ackTimeout = setTimeout(() => {
              if (this.sendState === SendState.WaitingAck) {
                // ACK timeout -> Assuming success
                this.sendState = SendState.Done;
                cleanup();
                this.onComplete?.();
                resolve();
              }
            }, 30000); // 30s timeout
          }
        } catch (err) {
          cleanup();
          reject(err);
        }
      };
      
      reader.onerror = () => {
        cleanup();
        reject(new Error('File read error'));
      };

      // Kick off
      readAndSend();
    });
  }

  // ==============================================================================
  // RECEIVER LOGIC
  // ==============================================================================

  receiveFile(
    onFileReceived: (file: File, metadata: FileMetadata) => void
  ): void {
    this.onFileReceived = onFileReceived;
    if (this.dataChannel) {
      this.setupFileReceptionHandlers(this.dataChannel);
    }
  }

  private setupFileReceptionHandlers(channel: RTCDataChannel): void {
    channel.onmessage = (event) => {
      // 1. Handling Protocol Messages (Strings)
      if (typeof event.data === 'string') {
        try {
          const msg = JSON.parse(event.data) as DCMessage;

          switch (msg.type) {
            case 'transfer_started':
              if (!msg.fileId || !msg.file_name || !msg.file_size) {
                 // Invalid transfer_started
                 return;
              }
              // Starting transfer
              
              // Reset state
              this.fileMetadata = {
                fileId: msg.fileId,
                totalSize: msg.file_size,
                fileName: msg.file_name,
                fileType: msg.file_type || 'application/octet-stream'
              };
              
              // Pre-allocate buffer logic
              try {
                this.activeTransferBuffer = new Uint8Array(msg.file_size);
              } catch (oom) {
                this.onError?.('Not enough memory for file transfer');
                return;
              }
              
              this.receivedBytes = 0;
              this.isTransferEndReceived = false;
              this.receiveState = ReceiveState.Receiving;
              break;

            case 'transfer_end':
              if (this.receiveState === ReceiveState.Receiving && this.fileMetadata?.fileId === msg.fileId) {
                // transfer_end received
                this.isTransferEndReceived = true;
                
                // Try finalize (if bytes also complete)
                this.tryFinalizeTransfer();
              } else {
                // Ignored transfer_end (ID mismatch or wrong state)
              }
              break;
              
            case 'ack':
                break;
          }
        } catch (e) {
          // Protocol Error ignored
        }
        return;
      }

      // 2. Handling Binary Chunks
      if (event.data instanceof ArrayBuffer) {
        // STRICT GUARD: Must be in Receiving state
        if (this.receiveState !== ReceiveState.Receiving || !this.fileMetadata || !this.activeTransferBuffer) {
          return; // Hard drop
        }

        const chunk = new Uint8Array(event.data);
        
        // Safety check bound
        if (this.receivedBytes + chunk.length > this.activeTransferBuffer.length) {
          // Overflow detected - dropping chunk
          // Can either drop or abort. Aborting is safer.
          // For now, let's stop accepting.
          return;
        }

        // Write directly to buffer
        this.activeTransferBuffer.set(chunk, this.receivedBytes);
        this.receivedBytes += chunk.length;
        
        // Progress O(1)
        const percent = (this.receivedBytes / this.fileMetadata.totalSize) * 100;
        
        // Throttled notification (every 1% or so, or every chunk if small)
        // Since we don't have throttle var, calling every chunk is okay-ish as it's just calc.
        this.onProgress?.({ percent, bytesTransferred: this.receivedBytes });

        // Try finalize (if end signal also received)
        this.tryFinalizeTransfer();
      }
    };
  }

  private tryFinalizeTransfer(): void {
    if (
        this.receiveState === ReceiveState.Receiving && 
        this.isTransferEndReceived && 
        this.receivedBytes >= (this.fileMetadata?.totalSize || 0)
    ) {
        this.finalizeTransfer();
    }
  }

  private finalizeTransfer(): void {
    const metadata = this.fileMetadata;
    const buffer = this.activeTransferBuffer;
    
    if (!metadata || !buffer) return;

    // Finalizing transfer. All checks passed.
    this.receiveState = ReceiveState.Done;
    
    // Create Blob from pre-allocated buffer
    const blob = new Blob([buffer as unknown as BlobPart], { type: metadata.fileType });
    const file = new File([blob], metadata.fileName, { type: metadata.fileType });
    
    // Notify app
    this.onFileReceived?.(file, {
      fileId: metadata.fileId,
      name: metadata.fileName,
      size: metadata.totalSize,
      type: metadata.fileType
    });

    // Cleanup heavy buffer immediately
    this.activeTransferBuffer = null; 

    // Send ACK via DataChannel
    try {
      if (this.dataChannel && this.dataChannel.readyState === 'open') {
        const ackMsg: DCMessage = {
          type: 'ack',
          fileId: this.fileMetadata.fileId
        };
        this.dataChannel.send(JSON.stringify(ackMsg));
        // ACK sent
      }
    } catch (e) {
      // Failed to send ACK
    }
    
    this.onComplete?.();
  }

  cleanup(): void {
    this.isCleaningUp = true;
    this.sendState = SendState.Idle;
    this.receiveState = ReceiveState.Idle;
    this.activeTransferBuffer = null;
    this.fileMetadata = null;

    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
  }
}
