import { SignalingClient } from './signaling';
import { SignalingMessage } from './types';

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
}

export interface TransferProgress {
  percent: number;
  bytesTransferred: number;
}

export class WebRTCFileTransfer {
  private pc: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private signaling: SignalingClient;
  private iceServers: RTCConfiguration;
  private onProgress?: (progress: TransferProgress) => void;
  private onComplete?: () => void;
  private onError?: (error: string) => void;
  private onDataChannelOpen?: () => void;
  private onFileReceived?: (file: File, metadata: FileMetadata) => void;
  private receivedChunks: Uint8Array[] = [];
  private fileMetadata: { totalSize: number; fileName: string; fileType: string } | null = null;
  private isCleaningUp: boolean = false;
  private isTransferComplete: boolean = false;

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
    this.signaling.on('offer', (msg) => {
      this.handleOffer(msg.sdp);
    });

    this.signaling.on('answer', (msg) => {
      this.handleAnswer(msg.sdp);
    });

    this.signaling.on('ice_candidate', (msg) => {
      this.handleIceCandidate(msg);
    });

    this.signaling.on('peer_connected', () => {
      // Peer connected
    });

    this.signaling.on('peer_disconnected', () => {
      this.cleanup();
    });
  }

  async initializeAsSender(): Promise<void> {
    this.pc = new RTCPeerConnection(this.iceServers);

    // Create data channel for file transfer
    this.dataChannel = this.pc.createDataChannel('fileTransfer', {
      ordered: true,
    });

    this.setupDataChannel(this.dataChannel);

    // Handle ICE candidates
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

    // Create and send offer
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
      this.setupDataChannel(this.dataChannel);
    };

    // Handle ICE candidates
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
      if (!this.isCleaningUp && !this.isTransferComplete) {
        console.error('Data channel error:', error);
        this.onError?.('Data channel error');
      } else {
        // Data channel closed during cleanup (expected)
      }
    };

    channel.onclose = () => {
      // Data channel closed
    };

    // Setup file reception handlers if callback was registered
    if (this.onFileReceived) {
      this.setupFileReceptionHandlers(channel);
    }
  }

  private setupFileReceptionHandlers(channel: RTCDataChannel): void {
    // Listen for metadata
    this.signaling.on('transfer_started', (msg) => {
      console.log('DEBUG: transfer_started received', msg);
      this.fileMetadata = {
        totalSize: msg.file_size,
        fileName: msg.file_name,
        fileType: msg.file_type || 'application/octet-stream',
      };
      this.receivedChunks = [];
    });

    // Listen for progress updates
    this.signaling.on('transfer_progress', (msg) => {
      this.onProgress?.({
        percent: msg.percent,
        bytesTransferred: msg.bytes_transferred,
      });
    });

    // Receive file chunks
    channel.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        this.receivedChunks.push(new Uint8Array(event.data));

        // Check if transfer is complete
        const receivedSize = this.receivedChunks.reduce((sum, chunk) => sum + chunk.length, 0);
        
        // Debug: Log every 10th chunk or when complete
        if (this.receivedChunks.length % 10 === 0 || (this.fileMetadata && receivedSize >= this.fileMetadata.totalSize)) {
          console.log('DEBUG: Received chunks', this.receivedChunks.length, 'size', receivedSize, 'totalSize', this.fileMetadata?.totalSize);
        }

        if (this.fileMetadata && receivedSize >= this.fileMetadata.totalSize) {
          console.log('DEBUG: Transfer complete, reconstructing file');
          this.isTransferComplete = true;
          
          // Reconstruct file
          const allChunks = new Uint8Array(receivedSize);
          let position = 0;
          for (const chunk of this.receivedChunks) {
            allChunks.set(chunk, position);
            position += chunk.length;
          }

          const blob = new Blob([allChunks], { type: this.fileMetadata.fileType });
          const file = new File([blob], this.fileMetadata.fileName, { type: this.fileMetadata.fileType });

          this.onFileReceived?.(file, {
            name: this.fileMetadata.fileName,
            size: this.fileMetadata.totalSize,
            type: this.fileMetadata.fileType,
          });

          // Send ACK to sender that file was received completely
          this.signaling.send({ type: 'receive_completed' });
          
          this.onComplete?.();
        }
      }
    };

    this.signaling.on('transfer_completed', () => {
      // Transfer completed
    });
  }

  async sendFile(file: File): Promise<void> {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      throw new Error('Data channel is not open');
    }

    // Send file metadata
    this.signaling.send({
      type: 'transfer_started',
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
    });

    const CHUNK_SIZE = 16 * 1024; // 16KB chunks
    let offset = 0;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) {
          reject(new Error('Failed to read file chunk'));
          return;
        }

        const chunk = e.target.result as ArrayBuffer;
        this.dataChannel?.send(chunk);
        offset += chunk.byteLength;

        // Report progress
        const percent = (offset / file.size) * 100;
        const bytesTransferred = offset;

        this.onProgress?.({ percent, bytesTransferred });

        this.signaling.send({
          type: 'transfer_progress',
          percent,
          bytes_transferred: bytesTransferred,
        });

        if (offset < file.size) {
          // Read next chunk
          const slice = file.slice(offset, offset + CHUNK_SIZE);
          reader.readAsArrayBuffer(slice);
        } else {
          this.isTransferComplete = true;
          this.signaling.send({ type: 'transfer_completed' });
          
          // Wait for buffer to drain first
          const waitForBufferDrain = () => {
            const bufferedAmount = this.dataChannel?.bufferedAmount || 0;
            if (bufferedAmount === 0) {
              // Buffer drained, now wait for receiver ACK
              let ackReceived = false;
              
              // Listen for receive_completed ACK from receiver
              const ackHandler = () => {
                ackReceived = true;
                this.onComplete?.();
                resolve();
              };
              this.signaling.on('receive_completed', ackHandler);
              
              // Timeout fallback (30 seconds) in case ACK is lost
              setTimeout(() => {
                if (!ackReceived) {
                  this.signaling.off && this.signaling.off('receive_completed', ackHandler);
                  this.onComplete?.();
                  resolve();
                }
              }, 30000);
            } else {
              // Still buffering, check again
              setTimeout(waitForBufferDrain, 50);
            }
          };
          waitForBufferDrain();
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      // Start reading
      const slice = file.slice(offset, offset + CHUNK_SIZE);
      reader.readAsArrayBuffer(slice);
    });
  }

  receiveFile(
    onFileReceived: (file: File, metadata: FileMetadata) => void
  ): void {
    // Store the callback - handlers will be set up when data channel is ready
    this.onFileReceived = onFileReceived;

    // If data channel is already available, set up handlers immediately
    if (this.dataChannel) {
      this.setupFileReceptionHandlers(this.dataChannel);
    }
    // Otherwise, handlers will be set up in setupDataChannel when the channel is created
  }

  cleanup(): void {
    this.isCleaningUp = true;
    
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
