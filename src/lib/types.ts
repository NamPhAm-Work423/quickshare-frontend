// Signaling message types matching backend
export type SignalingMessage =
  | { type: 'offer'; sdp: string }
  | { type: 'answer'; sdp: string }
  | {
      type: 'ice_candidate';
      candidate: string;
      sdp_mid?: string;
      sdp_mline_index?: number;
    }
  | {
      type: 'transfer_started';
      file_name: string;
      file_size: number;
      file_type?: string;
    }
  | {
      type: 'transfer_progress';
      percent: number;
      bytes_transferred: number;
    }
  | { type: 'transfer_completed' }
  | { type: 'receive_completed' }
  | { type: 'transfer_failed'; error: string }
  | { type: 'peer_connected'; client_id: string }
  | { type: 'peer_disconnected'; client_id: string }
  | { type: 'error'; message: string };

// API types
export interface CreateSessionRequest {
  single_use?: boolean;
  ttl_seconds?: number;
  metadata?: {
    file_name?: string;
    file_size?: number;
    file_type?: string;
  };
}

export interface CreateSessionResponse {
  code: string;
  session_id: string;
  ws_url: string;
  ice_servers: {
    ice_servers: Array<{
      urls: string[];
      username?: string;
      credential?: string;
    }>;
  };
}

export interface JoinSessionRequest {
  code: string;
}

export interface JoinSessionResponse {
  session_id: string;
  ws_token: string;
  ws_url: string;
  ice_servers: {
    ice_servers: Array<{
      urls: string[];
      username?: string;
      credential?: string;
    }>;
  };
  peer_info: {
    creator_client_id: string;
  };
}

export interface ApiError {
  error: string;
  code: number;
}

export interface DownloadByCodeResponse {
  type: 'file' | 'text';
  url?: string;
  content?: string;
}
