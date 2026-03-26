import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug, password } = req.body || {};
  if (!slug || !password) {
    return res.status(400).json({ error: 'Missing slug or password' });
  }

  let config;
  try {
    const raw = readFileSync(join(process.cwd(), 'docs.config.json'), 'utf8');
    config = JSON.parse(raw);
  } catch {
    return res.status(500).json({ error: 'Config not found' });
  }

  const doc = config.docs.find(d => d.slug === slug);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  if (doc.password && doc.password !== password) {
    return res.status(401).json({ error: 'Wrong password' });
  }

  // Read markdown
  let content;
  try {
    content = readFileSync(join(process.cwd(), doc.file), 'utf8');
  } catch {
    return res.status(500).json({ error: 'File not found' });
  }

  res.status(200).json({
    title: doc.title,
    content,
    author: doc.author,
    date: doc.date
  });
}
