import { EnvHandler, forwardJson, handleOptions, jsonResponse } from '../_utils';

export const onRequest: EnvHandler = async (context) => {
  try {
    if (context.request.method === 'OPTIONS') {
      return handleOptions();
    }

    if (context.request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    const payload = await context.request.json();
    return forwardJson(context, '/api/session/join', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse({ error: message }, 500);
  }
};

