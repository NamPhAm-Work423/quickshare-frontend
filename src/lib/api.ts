import {
  CreateSessionRequest,
  CreateSessionResponse,
  JoinSessionRequest,
  JoinSessionResponse,
  ApiError,
  DownloadByCodeResponse,
} from './types';

const getApiBase = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // During build/static export, default to local dev origin.
  return 'http://localhost:3000';
};

const buildUrl = (path: string): string => new URL(path, `${getApiBase()}/`).toString();

export async function createSession(
  request: CreateSessionRequest
): Promise<CreateSessionResponse> {
  try {
    const response = await fetch(buildUrl('/api/session/create'), {
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
    // Handle network errors (function not reachable, CORS, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        'Cannot connect to API. Please ensure the Cloudflare Function is reachable.',
      );
    }
    // Re-throw other errors as-is
    throw error;
  }
}

export async function joinSession(
  request: JoinSessionRequest
): Promise<JoinSessionResponse> {
  try {
    const response = await fetch(buildUrl('/api/session/join'), {
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
      throw new Error(
        'Cannot connect to API. Please ensure the Cloudflare Function is reachable.',
      );
    }
    throw error;
  }
}

export async function checkHealth(): Promise<{ status: string; version: string }> {
  try {
    const response = await fetch(buildUrl('/api/health'), {
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
        'Cannot connect to API. Please ensure the Cloudflare Function is reachable.',
      );
    }
    throw error;
  }
}

export async function downloadByCode(code: string): Promise<DownloadByCodeResponse> {
  try {
    const response = await fetch(buildUrl('/api/session/download'), {
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
      throw new Error(
        'Cannot connect to API. Please ensure the Cloudflare Function is reachable.',
      );
    }
    throw error;
  }
}

