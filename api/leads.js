// Store email leads to Vercel KV
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
    return res.status(200).json({ ok: true, note: 'KV not configured, lead not stored' });
  }

  if (req.method === 'POST') {
    const { slug, email } = req.body || {};
    if (!slug || !email) return res.status(400).json({ error: 'Missing slug or email' });

    // Store: hash key = pawprint:leads:<slug>, value = JSON array of {email, ts}
    const key = `pawprint:leads:${slug}`;
    const existing = await kvRequest(kvUrl, kvToken, ['GET', key]);
    const leads = existing ? JSON.parse(existing) : [];
    leads.push({ email, ts: new Date().toISOString() });
    await kvRequest(kvUrl, kvToken, ['SET', key, JSON.stringify(leads)]);

    return res.status(200).json({ ok: true });
  }

  if (req.method === 'GET') {
    const slug = req.query.slug;
    if (!slug) return res.status(400).json({ error: 'Missing slug' });
    const key = `pawprint:leads:${slug}`;
    const existing = await kvRequest(kvUrl, kvToken, ['GET', key]);
    return res.status(200).json({ leads: existing ? JSON.parse(existing) : [] });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
