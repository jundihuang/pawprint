#!/usr/bin/env node
// Encrypt a markdown file for PawPrint E2E storage
// Usage: node encrypt.js <input.md> <output.md> <password>
// The encrypted output is base64 — store this in the docs/ directory

const crypto = require('crypto');
const fs = require('fs');

const [,, inputPath, outputPath, password] = process.argv;
if (!inputPath || !outputPath || !password) {
  console.error('Usage: node encrypt.js <input.md> <output.md> <password>');
  process.exit(1);
}

const plaintext = fs.readFileSync(inputPath, 'utf8');

// Match browser Web Crypto: PBKDF2 + AES-GCM
const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);
const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
let encrypted = cipher.update(plaintext, 'utf8');
encrypted = Buffer.concat([encrypted, cipher.final()]);
const authTag = cipher.getAuthTag();

// Pack: salt(16) + iv(12) + ciphertext + authTag(16)
const packed = Buffer.concat([salt, iv, encrypted, authTag]);
const base64 = packed.toString('base64');

fs.writeFileSync(outputPath, base64, 'utf8');
console.log(`✅ Encrypted: ${inputPath} → ${outputPath}`);
console.log(`🔑 Decryption key: ${password}`);
console.log(`🔗 Share link: /docs#key=${encodeURIComponent(password)}`);
