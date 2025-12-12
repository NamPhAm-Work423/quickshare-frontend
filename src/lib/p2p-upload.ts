import { createSession, joinSession } from './api';
import { SignalingClient } from './signaling';
import { WebRTCFileTransfer } from './webrtc';
import { CreateSessionRequest, JoinSessionRequest } from './types';

export interface P2PUploadOptions {
  file?: File;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export async function startP2PUpload(options: P2PUploadOptions) {
  const { file, onProgress, onComplete, onError } = options;

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

    // Initialize WebRTC as sender
    const webrtc = new WebRTCFileTransfer(signaling, iceServers, {
      onProgress: (progress) => {
        onProgress?.(progress.percent);
      },
      onComplete: () => {
        onComplete?.();
        webrtc.cleanup();
        signaling.disconnect();
      },
      onError: (error) => {
        onError?.(error);
        webrtc.cleanup();
        signaling.disconnect();
      },
    });

    await webrtc.initializeAsSender();

    // Wait for peer connection
    return new Promise<void>((resolve, reject) => {
      let peerConnected = false;

      signaling.on('peer_connected', () => {
        peerConnected = true;
        // Start sending file
        webrtc
          .sendFile(file)
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!peerConnected) {
          reject(new Error('Peer connection timeout'));
          webrtc.cleanup();
          signaling.disconnect();
        }
      }, 30000);
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
      : `${joinResponse.ws_url}&token=${joinResponse.ws_token}`;
    const signaling = new SignalingClient(
      joinResponse.session_id,
      clientId,
      wsUrlWithToken
    );

    await signaling.connect();

    // Initialize WebRTC as receiver
    const webrtc = new WebRTCFileTransfer(signaling, iceServers, {
      onProgress: (progress) => {
        onProgress?.(progress.percent);
      },
      onComplete: () => {
        webrtc.cleanup();
        signaling.disconnect();
      },
      onError: (error) => {
        onError?.(error);
        webrtc.cleanup();
        signaling.disconnect();
      },
    });

    await webrtc.initializeAsReceiver();

    // Set up file reception
    webrtc.receiveFile((file, metadata) => {
      onFileReceived(file);
    });

    return {
      sessionId: joinResponse.session_id,
      clientId,
      signaling,
      webrtc,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Receive failed';
    onError?.(errorMessage);
    throw error;
  }
}
