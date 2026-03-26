import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST with site password.' });
  }

  const { password } = req.body || {};

  const bases = [
    process.cwd(),
    join(process.cwd(), '..'),
    dirname(fileURLToPath(import.meta.url)),
    join(dirname(fileURLToPath(import.meta.url)), '..'),
  ];

  let config;
  for (const base of bases) {
    const configPath = join(base, 'docs.config.json');
    if (existsSync(configPath)) {
      try {
        config = JSON.parse(readFileSync(configPath, 'utf8'));
        break;
      } catch {}
    }
  }

  if (!config) {
    return res.status(500).json({ error: 'Config not found' });
  }

  if (config.site.password && config.site.password !== password) {
    return res.status(401).json({ error: 'Wrong site password' });
  }

  const docs = config.docs.map(d => ({
    slug: d.slug,
    category: d.category || 'resources',
    title: d.title,
    description: d.description,
    icon: d.icon || '📄',
    date: d.date,
    author: d.author,
    locked: !!d.password
  }));

  res.status(200).json({
    site: { title: config.site.title, description: config.site.description },
    categories: config.categories || [],
    docs
  });
}
