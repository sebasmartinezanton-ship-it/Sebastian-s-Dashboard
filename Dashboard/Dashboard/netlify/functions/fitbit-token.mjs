// Google OAuth proxy — handles authorization_code exchange and refresh_token.
// Required env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors() });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: cors() });
  }

  let body;
  try { body = await req.json(); }
  catch { return new Response('Invalid JSON', { status: 400, headers: cors() }); }

  const clientId     = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri  = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret) {
    return new Response('Server not configured (missing env vars)', { status: 500, headers: cors() });
  }

  const params = new URLSearchParams({ client_id: clientId, client_secret: clientSecret });

  if (body.grant_type === 'authorization_code') {
    if (!body.code) return new Response('Missing code', { status: 400, headers: cors() });
    params.set('grant_type',   'authorization_code');
    params.set('code',         body.code);
    params.set('redirect_uri', body.redirect_uri || redirectUri);
  } else if (body.grant_type === 'refresh_token') {
    if (!body.refresh_token) return new Response('Missing refresh_token', { status: 400, headers: cors() });
    params.set('grant_type',    'refresh_token');
    params.set('refresh_token', body.refresh_token);
  } else {
    return new Response('Unsupported grant_type', { status: 400, headers: cors() });
  }

  const googleResp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  const data = await googleResp.json();

  return new Response(JSON.stringify(data), {
    status: googleResp.status,
    headers: { 'Content-Type': 'application/json', ...cors() }
  });
};

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

export const config = { path: '/.netlify/functions/fitbit-token' };
