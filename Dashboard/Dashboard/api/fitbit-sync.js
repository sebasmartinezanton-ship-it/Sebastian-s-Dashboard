// Fitbit token cross-device sync via Vercel KV.
// GET  → returns { access_token, expiry } (or {} if none / KV not configured)
// PUT  → stores { access_token, expiry } with a 7-day TTL

const KEY = 'fitbit-token';

async function kvGet(url, token) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['GET', KEY]),
  });
  const { result } = await r.json();
  return result ? JSON.parse(result) : null;
}

async function kvSet(url, token, value) {
  await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['SET', KEY, JSON.stringify(value), 'EX', 604800]),
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const kvUrl   = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (!kvUrl || !kvToken) {
    if (req.method === 'GET') return res.status(200).json({});
    if (req.method === 'PUT') return res.status(200).json({ ok: true });
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (req.method === 'GET') {
      const data = await kvGet(kvUrl, kvToken);
      return res.status(200).json(data || {});
    }

    if (req.method === 'PUT') {
      const { access_token, expiry } = req.body || {};
      if (!access_token || !expiry) {
        return res.status(400).json({ error: 'Missing access_token or expiry' });
      }
      if (expiry <= Date.now()) {
        return res.status(400).json({ error: 'Token already expired' });
      }
      await kvSet(kvUrl, kvToken, { access_token, expiry });
      return res.status(200).json({ ok: true });
    }
  } catch {
    if (req.method === 'GET') return res.status(200).json({});
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
