# 🔒 Password Protected Document

Congratulations! You entered the correct password.

This document demonstrates PawPrint's per-document password protection.

## How it works

1. Each document can have its own independent password
2. Passwords are verified **server-side** — never exposed in the browser
3. Password memory: once entered, remembered for 1 day (localStorage)

## Security layers available

- 🔒 **Password** — What you just used
- 🛡️ **E2E Encryption** — Content encrypted client-side, server never sees plaintext
- 📧 **Email Gate** — Require viewer's email before access
- 📜 **NDA** — Require agreement to confidentiality terms
- 🔥 **Burn-after-time** — Document auto-expires
- 💧 **Watermark** — Dynamic overlay with viewer info

All layers can be **combined** on a single document.

---

🐾 **PawPrint** — Leave your mark.
