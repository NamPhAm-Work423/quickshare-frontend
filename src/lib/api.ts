import {
  CreateSessionRequest,
  CreateSessionResponse,
  JoinSessionRequest,
  JoinSessionResponse,
  ApiError,
  DownloadByCodeResponse,
} from './types';

const isDevelopment = (): boolean => {
  if (typeof window === 'undefined') {
    return true; // Default to development during build
  }
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
};

const getApiBase = (): string => {
  if (typeof window !== 'undefined') {
    // Check for explicit backend URL override
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (backendUrl) {
      return backendUrl;
    }
    
    // In development (localhost), call backend directly
    if (isDevelopment()) {
      // Development: backend runs on port 3001
      return 'http://localhost:3001';
    }
    
    // Production (Cloudflare Pages): use same origin, functions will proxy
    // Cloudflare Functions will forward to backend using BACKEND_URL env var
    return window.location.origin;
  }
  
  // During build/static export
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
};

const buildUrl = (path: string): string => {
  const base = getApiBase();
  const isDev = isDevelopment();
  
  // In development, call backend directly (backend paths)
  // In production, call via Cloudflare Functions (functions paths)
  let apiPath = path;
  
  // Health endpoint: backend uses /health, functions use /api/health
  if (path === '/health' && !isDev && typeof window !== 'undefined') {
    apiPath = '/api/health';
  }
  
  // Remove trailing slash from base if present, then add path
  const baseUrl = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${baseUrl}${apiPath}`;
};

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
    const response = await fetch(buildUrl('/health'), {
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

