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

  constructor(
    signaling: SignalingClient,
    iceServers: RTCConfiguration,
    callbacks?: {
      onProgress?: (progress: TransferProgress) => void;
      onComplete?: () => void;
      onError?: (error: string) => void;
    }
  ) {
    this.signaling = signaling;
    this.iceServers = iceServers;
    this.onProgress = callbacks?.onProgress;
    this.onComplete = callbacks?.onComplete;
    this.onError = callbacks?.onError;

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
      console.log('Peer connected');
    });

    this.signaling.on('peer_disconnected', () => {
      console.log('Peer disconnected');
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
      console.log('Data channel opened');
    };

    channel.onerror = (error) => {
      console.error('Data channel error:', error);
      this.onError?.('Data channel error');
    };

    channel.onclose = () => {
      console.log('Data channel closed');
    };
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
          // Transfer complete
          this.signaling.send({ type: 'transfer_completed' });
          this.onComplete?.();
          resolve();
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
    if (!this.dataChannel) {
      throw new Error('Data channel is not available');
    }

    let receivedChunks: Uint8Array[] = [];
    let totalSize = 0;
    let fileName = '';
    let fileType = '';
    let metadataReceived = false;

    // Listen for metadata
    this.signaling.on('transfer_started', (msg) => {
      totalSize = msg.file_size;
      fileName = msg.file_name;
      fileType = msg.file_type || 'application/octet-stream';
      metadataReceived = true;
    });

    // Listen for progress updates
    this.signaling.on('transfer_progress', (msg) => {
      this.onProgress?.({
        percent: msg.percent,
        bytesTransferred: msg.bytes_transferred,
      });
    });

    // Receive file chunks
    this.dataChannel.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        receivedChunks.push(new Uint8Array(event.data));

        // Check if transfer is complete
        const receivedSize = receivedChunks.reduce((sum, chunk) => sum + chunk.length, 0);

        if (metadataReceived && receivedSize >= totalSize) {
          // Reconstruct file
          const allChunks = new Uint8Array(receivedSize);
          let position = 0;
          for (const chunk of receivedChunks) {
            allChunks.set(chunk, position);
            position += chunk.length;
          }

          const blob = new Blob([allChunks], { type: fileType });
          const file = new File([blob], fileName, { type: fileType });

          onFileReceived(file, {
            name: fileName,
            size: totalSize,
            type: fileType,
          });

          this.onComplete?.();
        }
      }
    };

    this.signaling.on('transfer_completed', () => {
      console.log('Transfer completed');
    });
  }

  cleanup(): void {
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
