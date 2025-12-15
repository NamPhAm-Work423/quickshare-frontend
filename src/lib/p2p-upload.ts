import { createSession, joinSession } from './api';
import { SignalingClient } from './signaling';
import { WebRTCFileTransfer } from './webrtc';
import { CreateSessionRequest, JoinSessionRequest } from './types';

export interface P2PUploadOptions {
  files?: File[];
  onProgress?: (progress: number) => void;
  onFileProgress?: (fileIndex: number, fileName: string, progress: number) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
  onSessionCreated?: (sessionInfo: { code: string; sessionId: string; expiresAt: Date }) => void;
}

export async function startP2PUpload(options: P2PUploadOptions) {
  const { files, onProgress, onComplete, onError, onSessionCreated } = options;

  if (!files || files.length === 0) {
    throw new Error('At least one file is required');
  }

  try {
    // Calculate total size for all files
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const fileNames = files.map(f => f.name).join(', ');
    
    // Create session with metadata about all files
    const createRequest: CreateSessionRequest = {
      single_use: true,
      metadata: {
        file_name: files.length === 1 ? files[0].name : `${files.length} files`,
        file_size: totalSize,
        file_type: files.length === 1 ? files[0].type : 'multiple',
      },
    };

    const sessionResponse = await createSession(createRequest);

    // Notify caller about session created (for UI to display code)
    onSessionCreated?.({
      code: sessionResponse.code,
      sessionId: sessionResponse.session_id,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Generate client ID
    const clientId = crypto.randomUUID();

    // Convert ICE servers to RTCConfiguration
    const iceServers: RTCConfiguration = {
      iceServers: sessionResponse.ice_servers.ice_servers.map((server) => ({
        urls: server.urls,
        username: server.username,
        credential: server.credential,
      })),
    };

    // Connect WebSocket
    const signaling = new SignalingClient(
      sessionResponse.session_id,
      clientId,
      sessionResponse.ws_url
    );

    await signaling.connect();

    // Wait for peer to connect, then start WebRTC handshake and file transfer
    return new Promise<void>((resolve, reject) => {
      let dataChannelOpened = false;
      let webrtc: WebRTCFileTransfer | null = null;
      let totalBytesSent = 0;
      let currentFileIndex = 0;

      // Listen for when receiver joins the session
      signaling.on('peer_connected', async () => {
        
        // Create WebRTC with onDataChannelOpen callback
        webrtc = new WebRTCFileTransfer(signaling, iceServers, {
          onProgress: (progress) => {
            // Calculate overall progress across all files
            const currentFileSize = files[currentFileIndex]?.size || 0;
            const currentFileBytes = (progress.percent / 100) * currentFileSize;
            const overallBytes = totalBytesSent + currentFileBytes;
            const overallProgress = (overallBytes / totalSize) * 100;
            onProgress?.(overallProgress);
          },
          onComplete: () => {
            onComplete?.();
            webrtc?.cleanup();
            signaling.disconnect();
          },
          onError: (error) => {
            onError?.(error);
            webrtc?.cleanup();
            signaling.disconnect();
          },
          onDataChannelOpen: () => {
            dataChannelOpened = true;
            // Start sending files when data channel is ready
            webrtc
              ?.sendFiles(files, (index, fileName) => {
                // Track bytes sent for progress calculation
                totalBytesSent += files[index].size;
                currentFileIndex = index + 1;
                options.onFileProgress?.(index, fileName, 100);
              })
              .then(() => {
                resolve();
              })
              .catch((err) => {
                reject(err);
              });
          },
        });

        // Now send the offer (receiver is ready to receive it)
        try {
          await webrtc.initializeAsSender();
        } catch (err) {
          reject(err);
        }
      });

      // Timeout after 10 minutes (peer connection + data channel)
      setTimeout(() => {
        if (!dataChannelOpened) {
          reject(new Error('Connection timeout - no peer connected or data channel failed'));
          webrtc?.cleanup();
          signaling.disconnect();
        }
      }, 600000);
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    onError?.(errorMessage);
    throw error;
  }
}


export interface P2PReceiveOptions {
  code: string;
  onFileReceived: (file: File) => void;
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
  onAllFilesComplete?: () => void;
}

export async function startP2PReceive(options: P2PReceiveOptions) {
  const { code, onFileReceived, onProgress, onError, onAllFilesComplete } = options;

  try {
    // Join session
    const joinRequest: JoinSessionRequest = { code };
    const joinResponse = await joinSession(joinRequest);

    // Generate client ID
    const clientId = crypto.randomUUID();

    // Convert ICE servers to RTCConfiguration
    const iceServers: RTCConfiguration = {
      iceServers: joinResponse.ice_servers.ice_servers.map((server) => ({
        urls: server.urls,
        username: server.username,
        credential: server.credential,
      })),
    };

    // Connect WebSocket with token
    // The ws_url already includes session_id and client_id, we just need to add token
    const wsUrlWithToken = joinResponse.ws_url.includes('token=')
      ? joinResponse.ws_url
      : `${joinResponse.ws_url}&token=${encodeURIComponent(joinResponse.ws_token)}`;
    const signaling = new SignalingClient(
      joinResponse.session_id,
      clientId,
      wsUrlWithToken
    );

    await signaling.connect();

    // Wait for file transfer to complete
    return new Promise<void>((resolve, reject) => {
      // Initialize WebRTC as receiver
      const webrtc = new WebRTCFileTransfer(signaling, iceServers, {
        onProgress: (progress) => {
          onProgress?.(progress.percent);
        },
        onComplete: () => {
          // This is called when all_transfers_complete is received
          webrtc.cleanup();
          signaling.disconnect();
          onAllFilesComplete?.();
          resolve();
        },
        onError: (error) => {
          onError?.(error);
          webrtc.cleanup();
          signaling.disconnect();
          reject(new Error(error));
        },
      });

      webrtc.initializeAsReceiver().then(() => {
        // Set up file reception - callback is called for EACH file received
        webrtc.receiveFile(
          (file, metadata) => {
            onFileReceived(file);
          },
          () => {
            // Called when all_transfers_complete is received
            webrtc.cleanup();
            signaling.disconnect();
            onAllFilesComplete?.();
            resolve();
          }
        );
      }).catch(reject);

      // Timeout after 10 minutes for large/multiple files
      setTimeout(() => {
        reject(new Error('File transfer timeout'));
        webrtc.cleanup();
        signaling.disconnect();
      }, 10 * 60 * 1000);
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Receive failed';
    onError?.(errorMessage);
    throw error;
  }
}

