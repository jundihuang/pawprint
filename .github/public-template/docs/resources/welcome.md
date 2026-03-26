# 👋 Welcome to PawPrint

PawPrint is a lightweight, zero-database document sharing platform.

## How it works

1. **Write** — Create Markdown documents
2. **Protect** — Set passwords, E2E encryption, email gates, NDAs
3. **Share** — Send a link, recipients enter the password to view
4. **Track** — See who viewed, how far they read, collect emails

## Quick Start

### Add a document

Create a `.md` file in the `docs/` directory under the right category:

```
docs/
├── projects/    → Time-bound deliverables
├── areas/       → Ongoing responsibilities  
├── resources/   → Reference materials
└── archives/    → Completed or inactive
```

### Register it

Add an entry to `docs.config.json`:

```json
{
  "slug": "my-doc",
  "category": "projects",
  "title": "My Document",
  "description": "A brief description",
  "file": "docs/projects/my-doc.md",
  "password": "optional-password",
  "icon": "📄",
  "date": "2026-03-26",
  "author": "Your Name"
}
```

### Deploy

Push to Git → Vercel auto-deploys. That's it.

## Available Protection Options

| Option | Config Field | Description |
|--------|-------------|-------------|
| 🔒 Password | `"password": "xxx"` | Per-document password |
| 🛡️ E2E Encryption | `"encrypted": true` | AES-256-GCM, key in URL fragment |
| 📧 Email Gate | `"requireEmail": true` | Collect viewer emails |
| 📜 NDA | `"requireNDA": true` | Require agreement before access |
| 🔥 Burn | `"expiresAt": "2026-12-31"` | Auto-expire after date |

## Learn More

- [README](https://github.com/jundihuang/pawprint) — User guide
- [DEVELOPER.md](https://github.com/jundihuang/pawprint/blob/main/DEVELOPER.md) — Technical docs
- [CHANGELOG.md](https://github.com/jundihuang/pawprint/blob/main/CHANGELOG.md) — Version history

---

🐾 **PawPrint** — Leave your mark.
