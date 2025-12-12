import type { PagesFunction, Response as CfResponse } from '@cloudflare/workers-types';

type JsonValue = Record<string, unknown> | unknown[] | string | number | boolean | null;
type Env = { BACKEND_URL: string };
export type EnvHandler = PagesFunction<Env>;

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type',
};

const toCfResponse = (res: Response): CfResponse => res as unknown as CfResponse;

export const handleOptions = (): CfResponse =>
  toCfResponse(
    new Response(null, {
      status: 204,
      headers: corsHeaders,
    }),
  );

export const jsonResponse = (
  data: JsonValue,
  status = 200,
  extraHeaders?: Record<string, string>,
): CfResponse =>
  toCfResponse(
    new Response(JSON.stringify(data), {
      status,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        ...corsHeaders,
        ...extraHeaders,
      },
    }),
  );

const buildBackendUrl = (base: string | undefined, path: string): string => {
  if (!base) {
    throw new Error('Missing BACKEND_URL in environment');
  }
  return new URL(path, base).toString();
};

export const forwardJson = async (
  context: Parameters<PagesFunction<Env>>[0],
  path: string,
  init: RequestInit,
): Promise<CfResponse> => {
  const url = buildBackendUrl(context.env?.BACKEND_URL as string | undefined, path);
  const upstream = await fetch(url, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...init.headers,
    },
  });

  const bodyText = await upstream.text();
  const contentType = upstream.headers.get('content-type') ?? 'application/json';

  return toCfResponse(
    new Response(bodyText, {
      status: upstream.status,
      headers: {
        ...corsHeaders,
        'content-type': contentType,
      },
    }),
  );
};

