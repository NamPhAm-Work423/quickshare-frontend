import {
  CreateSessionRequest,
  CreateSessionResponse,
  JoinSessionRequest,
  JoinSessionResponse,
  ApiError,
  DownloadByCodeResponse,
} from './types';

// Normalize backend URL for production-safe usage.
// Priority: explicit env -> browser origin -> localhost dev fallback.
const normalizeBaseUrl = (value: string): string => value.replace(/\/+$/, '');

const getBackendUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (envUrl) {
    return normalizeBaseUrl(envUrl);
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    const backendPort = '3001';
    const origin = `${protocol}//${hostname}:${backendPort}`;
    return normalizeBaseUrl(origin);
  }

  return 'http://localhost:3001';
};

const buildUrl = (base: string, path: string): string =>
  new URL(path, `${base}/`).toString();

export async function createSession(
  request: CreateSessionRequest
): Promise<CreateSessionResponse> {
  const backendUrl = getBackendUrl();
  
  try {
    const response = await fetch(buildUrl(backendUrl, '/api/session/create'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      // Try to parse error response
      try {
        const error = (await response.json()) as ApiError;
        throw new Error(error.error || 'Failed to create session');
      } catch (parseError) {
        throw new Error(`Backend returned error: ${response.status} ${response.statusText}`);
      }
    }

    return response.json() as Promise<CreateSessionResponse>;
  } catch (error) {
    // Handle network errors (backend not running, CORS, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Network error - backend might not be running or CORS issue
      const isCorsError = error.message.includes('CORS') || error.message.includes('Failed to fetch');
      if (isCorsError) {
        throw new Error(
          `CORS error: Backend at ${backendUrl} is not allowing requests from ${typeof window !== 'undefined' ? window.location.origin : 'this origin'}. ` +
          'Please check backend CORS configuration.'
        );
      }
      throw new Error(
        `Cannot connect to backend at ${backendUrl}. ` +
        'Please ensure the backend server is running and accessible.'
      );
    }
    // Re-throw other errors as-is
    throw error;
  }
}

export async function joinSession(
  request: JoinSessionRequest
): Promise<JoinSessionResponse> {
  const backendUrl = getBackendUrl();
  
  try {
    const response = await fetch(buildUrl(backendUrl, '/api/session/join'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      try {
        const error = (await response.json()) as ApiError;
        throw new Error(error.error || 'Failed to join session');
      } catch (parseError) {
        throw new Error(`Backend returned error: ${response.status} ${response.statusText}`);
      }
    }

    return response.json() as Promise<JoinSessionResponse>;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const isCorsError = error.message.includes('CORS') || error.message.includes('Failed to fetch');
      if (isCorsError) {
        throw new Error(
          `CORS error: Backend at ${backendUrl} is not allowing requests. ` +
          'Please check backend CORS configuration.'
        );
      }
      throw new Error(
        `Cannot connect to backend at ${backendUrl}. ` +
        'Please ensure the backend server is running.'
      );
    }
    throw error;
  }
}

export async function checkHealth(): Promise<{ status: string; version: string }> {
  const backendUrl = getBackendUrl();
  
  try {
    const response = await fetch(buildUrl(backendUrl, '/health'), {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Cannot connect to backend at ${backendUrl}. ` +
        'Please ensure the backend server is running.'
      );
    }
    throw error;
  }
}

export async function downloadByCode(code: string): Promise<DownloadByCodeResponse> {
  const backendUrl = getBackendUrl();
  
  try {
    const response = await fetch(buildUrl(backendUrl, '/api/session/download'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      try {
        const error = (await response.json()) as ApiError;
        throw new Error(error.error || 'Failed to download by code');
      } catch (parseError) {
        throw new Error(`Backend returned error: ${response.status} ${response.statusText}`);
      }
    }

    return response.json() as Promise<DownloadByCodeResponse>;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const isCorsError = error.message.includes('CORS') || error.message.includes('Failed to fetch');
      if (isCorsError) {
        throw new Error(
          `CORS error: Backend at ${backendUrl} is not allowing requests. ` +
          'Please check backend CORS configuration.'
        );
      }
      throw new Error(
        `Cannot connect to backend at ${backendUrl}. ` +
        'Please ensure the backend server is running.'
      );
    }
    throw error;
  }
}

