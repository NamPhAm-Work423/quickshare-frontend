import type { PagesFunction, Response as CfResponse } from '@cloudflare/workers-types';

// Middleware to keep the site “dynamic” for Cloudflare while still serving static assets.
export const onRequest: PagesFunction = async (ctx) => {
  // Health/proof route to demonstrate dynamic execution.
  if (ctx.request.url.includes('/_dynamic-check')) {
    const envKeys = Object.keys(ctx.env ?? {});
    return new Response(
      JSON.stringify({
        ok: true,
        runtime: 'cloudflare-pages-functions',
        envKeys,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
        },
      },
    ) as unknown as CfResponse;
  }

  const res = (await ctx.next()) as CfResponse;
  // Tag all responses so Cloudflare treats this as a dynamic worker.
  res.headers.set('x-app-runtime', 'cloudflare-pages');
  return res;
};

