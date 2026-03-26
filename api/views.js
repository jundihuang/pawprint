// View counter using Vercel KV (Upstash Redis REST API)
// Env vars: KV_REST_API_URL, KV_REST_API_TOKEN (auto-set by Vercel KV)

async function kvRequest(url, token, command) {
  const res = await fetch(`${url}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  const data = await res.json();
  return data.result;
}

module.exports = async function handler(req, res) {
  // Support both prefixed and standard env var names
  const kvUrl = process.env.KV_REST_API_URL || process.env.pawprint_KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.pawprint_KV_REST_API_TOKEN;

  if (!kvUrl || !kvToken) {
    return res.status(200).json({ error: 'KV not configured', views: {} });
  }

  // POST = increment view for a slug
  if (req.method === 'POST') {
    const { slug } = req.body || {};
    if (!slug) return res.status(400).json({ error: 'Missing slug' });

    const count = await kvRequest(kvUrl, kvToken, ['HINCRBY', 'pawprint:views', slug, 1]);
    return res.status(200).json({ slug, views: count });
  }

  // GET = get all view counts
  if (req.method === 'GET') {
    const result = await kvRequest(kvUrl, kvToken, ['HGETALL', 'pawprint:views']);
    // Redis returns flat array: [key, val, key, val, ...]
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
