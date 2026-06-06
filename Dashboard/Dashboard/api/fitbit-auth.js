// Starts the Google Fit OAuth flow — redirects the browser to Google's consent page.
// The client_id lives here server-side so it never needs to be in the frontend HTML.

export default function handler(req, res) {
  const clientId   = (process.env.GOOGLE_CLIENT_ID || '').trim();
  const base       = 'https://' + req.headers.host;
  const redirectUri = base + '/api/fitbit-callback';

  if (!clientId) {
    return res.status(500).send('GOOGLE_CLIENT_ID env var not set');
  }

  const scopes = [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.heart_rate.read',
    'https://www.googleapis.com/auth/fitness.sleep.read',
    'https://www.googleapis.com/auth/fitness.body.read',
    'https://www.googleapis.com/auth/fitness.location.read',
    'https://www.googleapis.com/auth/fitness.nutrition.read',
  ].join(' ');

  const url = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
    client_id:     clientId,
    redirect_uri:  redirectUri,
    response_type: 'code',
    scope:         scopes,
    access_type:   'offline',
    prompt:        'consent',
  });

  return res.redirect(302, url);
}
