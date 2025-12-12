import { EnvHandler, forwardJson, handleOptions, jsonResponse } from './_utils';

export const onRequest: EnvHandler = async (context) => {
  try {
    if (context.request.method === 'OPTIONS') {
      return handleOptions();
    }

    if (context.request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    return forwardJson(context, '/health', { method: 'GET' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse({ error: message }, 500);
  }
};

