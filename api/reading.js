// Reading depth analytics — stores scroll depth + time per doc view

async function kvRequest(url, token, command) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const data = await res.json();
  return data.result;
}

module.exports = async function handler(req, res) {
  const kvUrl = process.env.KV_REST_API_URL || process.env.pawprint_KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.pawprint_KV_REST_API_TOKEN;

  if (!kvUrl || !kvToken) {
    return res.status(200).json({ ok: true, note: 'KV not configured' });
  }

  if (req.method === 'POST') {
    // sendBeacon sends text/plain, parse body
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
    }
    const { slug, depth, duration, email } = body || {};
    if (!slug) return res.status(400).json({ error: 'Missing slug' });

    const event = JSON.stringify({
      slug, depth, duration,
      email: email || 'anonymous',
      ts: new Date().toISOString()
    });
    await kvRequest(kvUrl, kvToken, ['LPUSH', 'pawprint:reading', event]);
    await kvRequest(kvUrl, kvToken, ['LTRIM', 'pawprint:reading', 0, 99]);

    return res.status(200).json({ ok: true });
  }

  if (req.method === 'GET') {
    const slug = req.query.slug;
    const events = await kvRequest(kvUrl, kvToken, ['LRANGE', 'pawprint:reading', 0, 99]);
    let parsed = (events || []).map(e => { try { return JSON.parse(e); } catch { return null; } }).filter(Boolean);
    if (slug) parsed = parsed.filter(e => e.slug === slug);
    return res.status(200).json({ readings: parsed });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
