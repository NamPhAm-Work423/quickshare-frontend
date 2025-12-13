import { createSession, joinSession } from './api';
import { SignalingClient } from './signaling';
import { WebRTCFileTransfer } from './webrtc';
import { CreateSessionRequest, JoinSessionRequest } from './types';

export interface P2PUploadOptions {
  file?: File;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
  onSessionCreated?: (sessionInfo: { code: string; sessionId: string; expiresAt: Date }) => void;
}

export async function startP2PUpload(options: P2PUploadOptions) {
  const { file, onProgress, onComplete, onError, onSessionCreated } = options;

  if (!file) {
    throw new Error('File is required');
  }

  try {
    // Create session
    const createRequest: CreateSessionRequest = {
      single_use: true,
      metadata: {
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
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

      // Listen for when receiver joins the session
      signaling.on('peer_connected', async () => {
        
        // Create WebRTC with onDataChannelOpen callback
        webrtc = new WebRTCFileTransfer(signaling, iceServers, {
          onProgress: (progress) => {
            onProgress?.(progress.percent);
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
            // Start sending file when data channel is ready
            webrtc
              ?.sendFile(file)
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

      // Timeout after 60 seconds (peer connection + data channel)
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
}

export async function startP2PReceive(options: P2PReceiveOptions) {
  const { code, onFileReceived, onProgress, onError } = options;

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
          webrtc.cleanup();
          signaling.disconnect();
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
        // Set up file reception
        webrtc.receiveFile((file, metadata) => {
          onFileReceived(file);
        });
      }).catch(reject);

      // Timeout after 5 minutes for large files
      setTimeout(() => {
        reject(new Error('File transfer timeout'));
        webrtc.cleanup();
        signaling.disconnect();
      }, 5 * 60 * 1000);
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Receive failed';
    onError?.(errorMessage);
    throw error;
  }
}
