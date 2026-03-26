const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug, password } = req.body || {};
  if (!slug) {
    return res.status(400).json({ error: 'Missing slug' });
  }

  let config;
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'docs.config.json'), 'utf8');
    config = JSON.parse(raw);
  } catch (e) {
    return res.status(500).json({ error: 'Config not found', msg: e.message });
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

  // Check expiration (burn-after-time)
  if (doc.expiresAt && new Date(doc.expiresAt) < new Date()) {
    return res.status(410).json({ error: 'This document has expired', expired: true });
  }

  const filePath = path.join(process.cwd(), doc.file);
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    // Debug: list what's actually in cwd
    let listing = {};
    try {
      const docsDir = path.join(process.cwd(), 'docs');
      fs.readdirSync(docsDir).forEach(sub => {
        const subPath = path.join(docsDir, sub);
        try {
          if (fs.statSync(subPath).isDirectory()) {
            listing[sub] = fs.readdirSync(subPath);
          }
        } catch {}
      });
    } catch {}
    return res.status(500).json({ error: 'File not found', filePath, listing });
  }

  res.status(200).json({
    title: doc.title,
    content,
    author: doc.author,
    date: doc.date,
    encrypted: !!doc.encrypted
  });
};
