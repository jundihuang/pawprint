// View counter + notification log using Vercel KV (Upstash Redis REST API)

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
    return res.status(200).json({ error: 'KV not configured', views: {} });
  }

  // POST = increment view + log notification
  if (req.method === 'POST') {
    const { slug, title, email, notify } = req.body || {};
    if (!slug) return res.status(400).json({ error: 'Missing slug' });

    const count = await kvRequest(kvUrl, kvToken, ['HINCRBY', 'pawprint:views', slug, 1]);

    // Log view event for notifications
    if (notify) {
      const event = JSON.stringify({
        slug,
        title: title || slug,
        email: email || 'anonymous',
        ts: new Date().toISOString(),
        ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
        ua: (req.headers['user-agent'] || '').slice(0, 100)
      });
      // Keep last 50 events
      await kvRequest(kvUrl, kvToken, ['LPUSH', 'pawprint:events', event]);
      await kvRequest(kvUrl, kvToken, ['LTRIM', 'pawprint:events', 0, 49]);
    }

    return res.status(200).json({ slug, views: count });
  }

  // GET = get all view counts or recent events
  if (req.method === 'GET') {
    const type = req.query.type;

    if (type === 'events') {
      const events = await kvRequest(kvUrl, kvToken, ['LRANGE', 'pawprint:events', 0, 19]);
      return res.status(200).json({
        events: (events || []).map(e => { try { return JSON.parse(e); } catch { return e; } })
      });
    }

    const result = await kvRequest(kvUrl, kvToken, ['HGETALL', 'pawprint:views']);
    const views = {};
    if (Array.isArray(result)) {
      for (let i = 0; i < result.length; i += 2) {
        views[result[i]] = parseInt(result[i + 1]) || 0;
      }
    }
    return res.status(200).json({ views });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
