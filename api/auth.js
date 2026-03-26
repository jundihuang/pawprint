import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug, password } = req.body || {};
  if (!slug) {
    return res.status(400).json({ error: 'Missing slug' });
  }

  // Try multiple base paths
  const bases = [
    process.cwd(),
    join(process.cwd(), '..'),
    dirname(fileURLToPath(import.meta.url)),
    join(dirname(fileURLToPath(import.meta.url)), '..'),
  ];

  let config;
  let basePath;
  for (const base of bases) {
    const configPath = join(base, 'docs.config.json');
    if (existsSync(configPath)) {
      try {
        config = JSON.parse(readFileSync(configPath, 'utf8'));
        basePath = base;
        break;
      } catch {}
    }
  }

  if (!config) {
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

  const filePath = join(basePath, doc.file);
  if (!existsSync(filePath)) {
    return res.status(500).json({
      error: 'File not found',
      detail: doc.file,
      basePath,
      cwd: process.cwd()
    });
  }

  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch (err) {
    return res.status(500).json({ error: 'Read error', detail: err.message });
  }

  res.status(200).json({
    title: doc.title,
    content,
    author: doc.author,
    date: doc.date
  });
}
