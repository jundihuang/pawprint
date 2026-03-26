import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug, password } = req.body || {};
  if (!slug) {
    return res.status(400).json({ error: 'Missing slug' });
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

  if (doc.password) {
    if (!password || doc.password !== password) {
      return res.status(401).json({ error: 'Wrong password' });
    }
  }

  const filePath = join(process.cwd(), doc.file);
  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch (err) {
    return res.status(500).json({ error: 'File not found', detail: doc.file, cwd: process.cwd() });
  }

  res.status(200).json({
    title: doc.title,
    content,
    author: doc.author,
    date: doc.date
  });
}
