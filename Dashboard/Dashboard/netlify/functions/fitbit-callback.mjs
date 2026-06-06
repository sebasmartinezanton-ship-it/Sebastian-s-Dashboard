// Handles the Google OAuth callback server-side, exchanges the code for tokens,
// then redirects the browser back to /fitbit with tokens in the URL hash.
export default async (req) => {
  const url = new URL(req.url);
  const code  = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const base  = 'https://timely-creponne-905604.netlify.app';

  if (error || !code) {
    return Response.redirect(base + '/fitbit?auth_error=' + (error || 'no_code'), 302);
  }

  const clientId     = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri  = base + '/.netlify/functions/fitbit-callback';

  const params = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  });

  let tokens;
  try {
    const resp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    tokens = await resp.json();
    if (!resp.ok) throw new Error(tokens.error || resp.status);
  } catch (e) {
    return Response.redirect(base + '/fitbit?auth_error=' + encodeURIComponent(e.message), 302);
  }

  const expiry = Date.now() + (tokens.expires_in || 3600) * 1000;
  const hash = 'at=' + encodeURIComponent(tokens.access_token)
             + '&rt=' + encodeURIComponent(tokens.refresh_token || '')
             + '&exp=' + expiry;

  return Response.redirect(base + '/fitbit#' + hash, 302);
};

export const config = { path: '/.netlify/functions/fitbit-callback' };
