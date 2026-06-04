export default async function handler(req, res) {
  const { code, error } = req.query;
  const base = 'https://' + req.headers.host;

  if (error || !code) {
    return res.redirect(302, base + '/fitbit?auth_error=' + (error || 'no_code'));
  }

  const params = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: base + '/api/fitbit-callback',
    grant_type: 'authorization_code'
  });

  let tokens;
  try {
    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    tokens = await tokenResp.json();
    if (!tokenResp.ok) throw new Error(tokens.error || tokenResp.status);
  } catch (e) {
    return res.redirect(302, base + '/fitbit?auth_error=' + encodeURIComponent(e.message));
  }

  const expiry = Date.now() + (tokens.expires_in || 3600) * 1000;
  const hash = 'at=' + encodeURIComponent(tokens.access_token)
             + '&rt=' + encodeURIComponent(tokens.refresh_token || '')
             + '&exp=' + expiry;

  return res.redirect(302, base + '/fitbit#' + hash);
}
