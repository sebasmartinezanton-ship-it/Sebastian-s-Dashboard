// Cross-device sync store — backed by Vercel KV (Upstash Redis REST API).
// If KV_REST_API_URL / KV_REST_API_TOKEN env vars are absent the endpoint
// returns an empty state on GET and silently succeeds on PUT so the
// dashboard degrades gracefully to localStorage-only mode.

const KEY = 'dashboard-state';

async function kvGet(url, token) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['GET', KEY])
  });
  const { result } = await r.json();
  return result ? JSON.parse(result) : null;
}

async function kvSet(url, token, value) {
  await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['SET', KEY, JSON.stringify(value)])
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const kvUrl   = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  // No KV configured — graceful no-op
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
      const body = req.body;
      if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return res.status(400).json({ error: 'Body must be a JSON object' });
      }
      await kvSet(kvUrl, kvToken, body);
      return res.status(200).json({ ok: true });
    }
  } catch (err) {
    if (req.method === 'GET') return res.status(200).json({});
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
