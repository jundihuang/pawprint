import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  let config;
  try {
    const raw = readFileSync(join(process.cwd(), 'docs.config.json'), 'utf8');
    config = JSON.parse(raw);
  } catch {
    return res.status(500).json({ error: 'Config not found' });
  }

  // Return doc list without passwords and file paths
  const docs = config.docs.map(d => ({
    slug: d.slug,
    title: d.title,
    description: d.description,
    icon: d.icon || '📄',
    date: d.date,
    author: d.author,
    locked: !!d.password
  }));

  res.status(200).json({
    site: config.site,
    docs
  });
}
