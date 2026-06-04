export const config = { path: '/.netlify/functions/store' };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getBlobsConfig() {
  const raw = process.env.NETLIFY_BLOBS_CONTEXT;
  if (!raw) throw new Error('NETLIFY_BLOBS_CONTEXT is not set (not running on Netlify)');
  return JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
}

// Single blob URL that holds the entire synced state as a JSON object.
function blobUrl(cfg) {
  return `${cfg.edgeURL}/${cfg.siteID}/site:dashboard/state`;
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(req) {
  // Decode Netlify Blobs context from env var (base64-encoded JSON).
  let cfg;
  try {
    cfg = getBlobsConfig();
  } catch (err) {
    return jsonResponse({ error: 'Blobs not configured', detail: err.message }, 503);
  }

  const url     = blobUrl(cfg);
  const authHdr = { Authorization: `Bearer ${cfg.token}` };

  // ── GET ──────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const res = await fetch(url, { headers: authHdr });

    if (res.status === 404) return jsonResponse({});

    if (!res.ok) {
      const detail = await res.text();
      return jsonResponse({ error: 'Blob read failed', detail }, 502);
    }

    // Pass the raw JSON blob body straight through.
    const text = await res.text();
    return new Response(text, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── PUT / POST ───────────────────────────────────────────────────────────
  if (req.method === 'PUT' || req.method === 'POST') {
    let body;
    try {
      const text = await req.text();
      body = JSON.parse(text);
      if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        throw new Error('body must be a plain JSON object, not an array or primitive');
      }
    } catch (err) {
      return jsonResponse({ error: 'Invalid body', detail: err.message }, 400);
    }

    const res = await fetch(url, {
      method:  'PUT',
      headers: { ...authHdr, 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text();
      return jsonResponse({ error: 'Blob write failed', detail }, 502);
    }

    return jsonResponse({ ok: true });
  }

  return jsonResponse({ error: 'Method not allowed' }, 405);
}
