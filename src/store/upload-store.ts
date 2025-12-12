import { create } from 'zustand';

export interface UploadState {
  file: File | null;
  text: string | null;
  isUploading: boolean;
  uploadProgress: number;
  code: string | null;
  expirationTime: Date | null;
  error: string | null;
  // P2P state
  sessionId: string | null;
  clientId: string | null;
  wsUrl: string | null;
  iceServers: RTCConfiguration | null;
  isConnected: boolean;
  transferProgress: number;
}

export interface DownloadState {
  isLoading: boolean;
  error: string | null;
  contentType: 'file' | 'text' | null;
  downloadUrl: string | null;
  textContent: string | null;
}

interface AppStore {
  upload: UploadState;
  download: DownloadState;
  setFile: (file: File | null) => void;
  setText: (text: string | null) => void;
  setUploading: (isUploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setCode: (code: string | null) => void;
  setExpirationTime: (time: Date | null) => void;
  setUploadError: (error: string | null) => void;
  resetUpload: () => void;
  // P2P setters
  setSession: (sessionId: string, clientId: string, wsUrl: string, iceServers: RTCConfiguration) => void;
  setConnected: (connected: boolean) => void;
  setTransferProgress: (progress: number) => void;
  // Download
  setDownloadLoading: (isLoading: boolean) => void;
  setDownloadError: (error: string | null) => void;
  setDownloadContent: (contentType: 'file' | 'text', url?: string, text?: string) => void;
  resetDownload: () => void;
}

const initialUploadState: UploadState = {
  file: null,
  text: null,
  isUploading: false,
  uploadProgress: 0,
  code: null,
  expirationTime: null,
  error: null,
  sessionId: null,
  clientId: null,
  wsUrl: null,
  iceServers: null,
  isConnected: false,
  transferProgress: 0,
};

const initialDownloadState: DownloadState = {
  isLoading: false,
  error: null,
  contentType: null,
  downloadUrl: null,
  textContent: null,
};

export const useAppStore = create<AppStore>((set) => ({
  upload: initialUploadState,
  download: initialDownloadState,

  setFile: (file: File | null) =>
    set((state: AppStore) => ({
      upload: { ...state.upload, file, text: null },
    })),

  setText: (text: string | null) =>
    set((state: AppStore) => ({
      upload: { ...state.upload, text, file: null },
    })),

  setUploading: (isUploading: boolean) =>
    set((state: AppStore) => ({
      upload: { ...state.upload, isUploading },
    })),

  setUploadProgress: (uploadProgress: number) =>
    set((state: AppStore) => ({
      upload: { ...state.upload, uploadProgress },
    })),

  setCode: (code: string | null) =>
    set((state: AppStore) => ({
      upload: { ...state.upload, code },
    })),

  setExpirationTime: (expirationTime: Date | null) =>
    set((state: AppStore) => ({
      upload: { ...state.upload, expirationTime },
    })),

  setUploadError: (error: string | null) =>
    set((state: AppStore) => ({
      upload: { ...state.upload, error },
    })),

  resetUpload: () =>
    set({
      upload: initialUploadState,
    }),

  setSession: (sessionId: string, clientId: string, wsUrl: string, iceServers: RTCConfiguration) =>
    set((state: AppStore) => ({
      upload: {
        ...state.upload,
        sessionId,
        clientId,
        wsUrl,
        iceServers,
      },
    })),

  setConnected: (connected: boolean) =>
    set((state: AppStore) => ({
      upload: { ...state.upload, isConnected: connected },
    })),

  setTransferProgress: (progress: number) =>
    set((state: AppStore) => ({
      upload: { ...state.upload, transferProgress: progress },
    })),

  setDownloadLoading: (isLoading: boolean) =>
    set((state: AppStore) => ({
      download: { ...state.download, isLoading },
    })),

  setDownloadError: (error: string | null) =>
    set((state: AppStore) => ({
      download: { ...state.download, error, isLoading: false },
    })),

  setDownloadContent: (contentType: 'file' | 'text', url?: string, text?: string) =>
    set((state: AppStore) => ({
      download: {
        ...state.download,
        contentType,
        downloadUrl: url || null,
        textContent: text || null,
        isLoading: false,
        error: null,
      },
    })),

  resetDownload: () =>
    set({
      download: initialDownloadState,
    }),
}));

