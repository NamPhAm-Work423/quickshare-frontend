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
  private readonly MAX_BUFFER_SIZE = 64 * 1024; // 64KB buffer limit
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
    let lastProgressTime = 0;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Handle channel errors/close during transfer
      const errorHandler = (event: Event) => {
        const error = event instanceof ErrorEvent ? event.error : new Error('Data channel error');
        reject(error);
        cleanupListeners();
      };
      
      const closeHandler = () => {
        reject(new Error('Data channel closed unexpectedly'));
        cleanupListeners();
      };

      const cleanupListeners = () => {
        this.dataChannel?.removeEventListener('error', errorHandler);
        this.dataChannel?.removeEventListener('close', closeHandler);
      };

      this.dataChannel?.addEventListener('error', errorHandler);
      this.dataChannel?.addEventListener('close', closeHandler);

      reader.onload = (e) => {
        if (!e.target?.result) {
          reject(new Error('Failed to read file chunk'));
          cleanupListeners();
          return;
        }

        try {
          const chunk = e.target.result as ArrayBuffer;
          this.dataChannel?.send(chunk);
          offset += chunk.byteLength;

          // Report progress
          const percent = (offset / file.size) * 100;
          const bytesTransferred = offset;

          // Throttled progress reporting (every 100ms)
          const now = Date.now();
          if (now - lastProgressTime >= 100) {
            this.signaling.send({
              type: 'transfer_progress',
              percent,
              bytes_transferred: bytesTransferred,
            });
            lastProgressTime = now;
          }

          this.onProgress?.({
            percent,
            bytesTransferred,
          });
          
          if (offset < file.size) {
            if (this.dataChannel.bufferedAmount > this.MAX_BUFFER_SIZE) {
              const onBufferedAmountLow = () => {
                this.dataChannel?.removeEventListener('bufferedamountlow', onBufferedAmountLow);
                readNextChunk();
              };
              this.dataChannel.addEventListener('bufferedamountlow', onBufferedAmountLow);
            } else {
              readNextChunk();
            }
          } else {
            this.isTransferComplete = true;
            this.signaling.send({ type: 'transfer_completed' });
            
            // Setup ACK listener IMMEDIATELY before waiting
            let ackReceived = false;
            const ackPromise = new Promise<void>((resolveAck) => {
               const ackHandler = () => {
                 console.log('DEBUG: Received ACK from receiver');
                 ackReceived = true;
                 cleanupListeners();
                 this.onComplete?.();
                 resolveAck();
               };
               this.signaling.on('receive_completed', ackHandler);
               
               // Store cleanup for this specific listener
               const cleanupAck = () => {
                 this.signaling.off && this.signaling.off('receive_completed', ackHandler);
               };
               
               // Attach to ephemeral property or managed list if needed, 
               // but for now we rely on the main cleanupListeners/resolve flow
               // Actually we need to be able to remove this listener if we timeout.
               // Let's modify the outer scope variable.
               
               // Wait for buffer to drain
               const waitForBufferDrain = () => {
                 const bufferedAmount = this.dataChannel?.bufferedAmount || 0;
                 if (bufferedAmount === 0) {
                   // Buffer drained - wait 2s for network then check ACK
                   setTimeout(() => {
                     if (ackReceived) {
                       resolve(); // Already got ACK
                       return;
                     }
                     
                     // If not yet received, wait up to 30s (minus the 2s we already waited)
                     const timeoutId = setTimeout(() => {
                        if (!ackReceived) {
                          console.log('DEBUG: Transfer ACK timeout, forcing success');
                          cleanupAck();
                          cleanupListeners();
                          this.onComplete?.();
                          resolve();
                        }
                     }, 28000);
                     
                     // If we receive ACK during this wait, ackHandler will fire
                     // We need to make sure ackHandler resolves the OUTER promise
                     // We can't do that easily from inside.
                     // Let's restructure:
                   }, 2000);
                 } else {
                   setTimeout(waitForBufferDrain, 50);
                 }
               };
               waitForBufferDrain();
            });
            
            // Simplified Logic:
            // 1. Listen for ACK.
            // 2. Wait 2s (regardless of ACK).
            // 3. After 2s, if ACK verified => DONE.
            // 4. If not, wait until ACK or Timeout.
            
            const ackHandler = () => {
                 console.log('DEBUG: Received ACK from receiver');
                 ackReceived = true;
            };
            this.signaling.on('receive_completed', ackHandler);

            const waitForBufferDrain = () => {
              const bufferedAmount = this.dataChannel?.bufferedAmount || 0;
              if (bufferedAmount === 0) {
                 setTimeout(() => {
                    // Network settled.
                    if (ackReceived) {
                        finishSuccess();
                    } else {
                        // Wait for ACK with timeout
                        const checkInterval = setInterval(() => {
                            if (ackReceived) {
                                clearInterval(checkInterval);
                                clearTimeout(timeoutId);
                                finishSuccess();
                            }
                        }, 100);
                        
                  // Dynamic timeout based on file size
                  // Base 30s + 500ms per MB to allow for receiver processing/assembly time
                  const processingTimePerMB = 500;
                  const fileSizeMB = file.size / (1024 * 1024);
                  const dynamicTimeout = 30000 + Math.ceil(fileSizeMB * processingTimePerMB);
                  
                  // Timeout fallback
                  const timeoutId = setTimeout(() => {
                    clearInterval(checkInterval);
                    console.log(`DEBUG: ACK Timeout after ${dynamicTimeout}ms`);
                    finishSuccess(); // Assume success on timeout
                  }, dynamicTimeout);
                    }
                 }, 2000);
              } else {
                setTimeout(waitForBufferDrain, 50);
              }
            };
            
            const finishSuccess = () => {
                this.signaling.off && this.signaling.off('receive_completed', ackHandler);
                cleanupListeners();
                this.onComplete?.();
                resolve();
            };
            
            waitForBufferDrain();
          }
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Failed to send chunk'));
          cleanupListeners();
          return;
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
        cleanupListeners();
      };

      const readNextChunk = () => {
        const slice = file.slice(offset, offset + CHUNK_SIZE);
        reader.readAsArrayBuffer(slice);
      };

      // Start reading
      readNextChunk();
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
