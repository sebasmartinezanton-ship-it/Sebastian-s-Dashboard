export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { grant_type, code, redirect_uri, refresh_token } = req.body;

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    grant_type
  });

  if (grant_type === 'authorization_code') {
    params.set('code', code);
    params.set('redirect_uri', redirect_uri || process.env.GOOGLE_REDIRECT_URI);
  } else if (grant_type === 'refresh_token') {
    params.set('refresh_token', refresh_token);
  } else {
    return res.status(400).json({ error: 'Unsupported grant_type' });
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  const data = await response.json();
  return res.status(response.status).json(data);
}
