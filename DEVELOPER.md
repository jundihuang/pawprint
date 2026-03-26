# 🐾 PawPrint

[← 返回主页](./README.md) | [English](./DEVELOPER.md) | [中文](./DEVELOPER_zh.md)

**Leave your mark.** — Private docs, public simplicity.

PawPrint is a lightweight, zero-database document sharing platform. Write in Markdown, set a password, push to Git — done.

🔗 **Demo**: [pawprint-jayce.vercel.app](https://pawprint-jayce.vercel.app)

---

## ✨ Features

### Core
- **📝 Markdown First** — Tables, code blocks, quotes, images — all render beautifully
- **🔒 Two-Layer Passwords** — Site-level gate + per-document passwords, all verified server-side
- **🔗 Direct Links** — Share any doc via URL — passwordless docs bypass the site gate
- **🚀 Git Push to Deploy** — Manage docs in Git, Vercel auto-deploys on push
- **💾 Zero Database** — Pure static files + serverless functions
- **📂 PARA Organization** — Docs organized by Projects, Areas, Resources, Archives with tab routing
- **🔍 Search** — Real-time filtering by title, description, author

### Security & Privacy
- **🛡️ E2E Encryption** — Optional AES-256-GCM per-doc encryption. Key in URL fragment, never touches server
- **💧 Dynamic Watermark** — Semi-transparent overlay on protected docs showing viewer email/date
- **🔥 Burn-After-Time** — Docs with `expiresAt` auto-expire and disappear (API returns 410 Gone)
- **📧 Email Gate** — Require viewers to enter email before accessing a doc (leads stored in KV)
- **🧠 Password Memory** — Site password remembered 3 days, doc passwords 1 day (localStorage)

### Reading Experience
- **📑 TOC Sidebar** — Auto-generated table of contents with scroll spy
- **🎨 Syntax Highlighting** — highlight.js with theme-aware light/dark styles
- **📊 Mermaid Diagrams** — Flowcharts, sequence diagrams, pie charts auto-rendered
- **🌗 Dark/Light Theme** — Toggle with localStorage persistence

### Analytics
- **👁 View Counter** — Per-document read count (Vercel KV / Upstash Redis)
- **📊 Reading Depth** — Scroll depth %, time spent per doc
- **📧 Lead Collection** — Email addresses from gated docs
- **⚡ Activity Feed** — Who viewed what, when, from where
- **📈 Admin Dashboard** — `/admin` with stats, activity, leads, and reading analytics

### Export
- **📥 PDF Download** — Client-side A4 PDF generation
- **📄 MD Download** — Raw Markdown source file export

### AI Agent
- **🤖 OpenClaw Skill** — AI agents can publish docs with natural language
- **🔐 E2E Encrypt Script** — Agents can encrypt sensitive docs before publishing

## 🗂️ Project Structure

```
pawprint/
├── public/
│   ├── index.html        # Landing page (dark theme, parallax)
│   ├── docs.html         # Doc browser (password-gated)
│   └── admin.html        # Analytics dashboard
├── api/
│   ├── docs.js           # Doc list API (POST, site password)
│   ├── auth.js           # Doc content API (POST, per-doc password)
│   ├── views.js          # View counter + activity log
│   ├── leads.js          # Email lead storage
│   └── reading.js        # Scroll depth analytics
├── docs/                  # Your Markdown documents
│   ├── projects/          # Time-bound deliverables
│   ├── areas/             # Ongoing responsibilities
│   ├── resources/         # Reference materials
│   └── archives/          # Completed or inactive
├── skills/
│   └── pawprint-publish/  # OpenClaw AI agent skill
├── docs.config.json       # Site config + document registry
├── vercel.json            # Vercel routing config
├── CHANGELOG.md           # Full version history
└── package.json
```

## 🚀 Quick Start

### 1. Clone & Configure

```bash
git clone https://github.com/user/pawprint.git
cd pawprint
```

### 2. Add Your First Document

```bash
echo "# Hello World\n\nMy first private doc." > docs/projects/hello.md
```

### 3. Register in Config

Edit `docs.config.json`:

```json
{
  "site": {
    "title": "My Docs",
    "description": "Private knowledge base",
    "password": "your-site-password"
  },
  "categories": [
    { "id": "projects", "label": "Projects", "icon": "📂", "description": "Time-bound deliverables" },
    { "id": "areas", "label": "Areas", "icon": "📖", "description": "Ongoing areas" },
    { "id": "resources", "label": "Resources", "icon": "📚", "description": "Reference materials" },
    { "id": "archives", "label": "Archives", "icon": "📦", "description": "Completed or inactive" }
  ],
  "docs": [
    {
      "slug": "hello",
      "category": "projects",
      "title": "Hello World",
      "description": "My first doc",
      "file": "docs/projects/hello.md",
      "icon": "👋",
      "date": "2026-01-01",
      "author": "You"
    }
  ]
}
```

#### Document Config Options

| Field | Required | Description |
|-------|----------|-------------|
| `slug` | ✅ | URL-safe identifier |
| `category` | ✅ | `projects` / `areas` / `resources` / `archives` |
| `title` | ✅ | Display title |
| `description` | | One-line description |
| `file` | ✅ | Path to `.md` file |
| `password` | | Per-doc password (omit for public) |
| `icon` | | Emoji icon |
| `date` | | Publication date |
| `author` | | Author name |
| `encrypted` | | `true` for E2E encrypted docs |
| `expiresAt` | | ISO date — doc expires after this time |
| `requireEmail` | | `true` to require email before access |

### 4. Deploy to Vercel

**Option A: Auto-deploy via GitHub (recommended)**

1. Push your repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Click **"Import Git Repository"** → select your PawPrint repo
4. Keep all defaults (no framework, no build command needed) → click **Deploy**
5. Done. Every `git push` to `main` will auto-deploy

**Option B: CLI deploy**

```bash
npm i -g vercel
vercel          # first time: links project
vercel --prod   # deploy to production
```

> **Important**: Your git committer email must match a verified email on your GitHub account, otherwise Vercel will reject the deployment.

### 5. Enable Analytics (Optional)

Create a Vercel KV store (Upstash Redis) for view counts, leads, and reading analytics:

1. Vercel Dashboard → your project → **Storage** → **Upstash Redis**
2. Create a database → environment variables auto-injected
3. Redeploy once to pick up the new env vars

### 6. Access

| URL | What |
|-----|------|
| `/` | Landing page |
| `/docs` | Password-protected doc browser |
| `/docs/projects` | Filtered by category |
| `/docs#slug` | Direct link to a doc |
| `/admin` | Analytics dashboard |

## 📂 PARA Method

| Category | Folder | Use for |
|----------|--------|---------|
| 📂 Projects | `docs/projects/` | Time-bound deliverables (research, proposals, PRDs) |
| 📖 Areas | `docs/areas/` | Ongoing responsibilities (playbooks, processes) |
| 📚 Resources | `docs/resources/` | Reference material (guides, notes, collections) |
| 📦 Archives | `docs/archives/` | Completed or inactive content |

## 🔐 Security Model

| Layer | Scope | How | Memory |
|-------|-------|-----|--------|
| Site password | Entire `/docs` | Server-side POST | 3 days |
| Doc password | Individual doc | Server-side POST | 1 day |
| E2E encryption | Doc content | Client-side AES-256-GCM | Key in URL fragment |
| Email gate | Individual doc | Frontend modal → KV | Per session |
| Dynamic watermark | Protected docs | CSS overlay | — |
| Burn-after-time | Individual doc | Server-side expiry check | — |

- Passwords **never exposed** in client-side code
- E2E keys **never touch the server** (URL fragment only)
- API requires POST — no accidental GET leaks
- No cookies, no sessions, no tracking (except opt-in analytics)

## 🤖 AI Agent Integration (OpenClaw)

Any [OpenClaw](https://github.com/openclaw/openclaw) agent can publish docs with natural language:

> "Publish this research report to PawPrint under Projects"

### Install the Skill

```bash
cp -r skills/pawprint-publish ~/.openclaw/skills/shared/
```

Add to OpenClaw config:

```json
{
  "skills": {
    "load": {
      "extraDirs": ["~/.openclaw/skills/shared"]
    }
  }
}
```

### E2E Encrypted Publishing

```bash
node skills/pawprint-publish/scripts/encrypt.js input.md docs/projects/secret.md "my-key"
# Share: /docs/projects/secret#key=my-key
```

## 💡 Why PawPrint?

> Notion is a collaboration tool. Obsidian is a thinking tool. **PawPrint is a publishing tool** — and the only one AI agents can operate directly.

| | PawPrint | Notion | Obsidian | Papermark |
|--|---------|--------|----------|-----------|
| **AI agent publish** | ✅ `git push` | ❌ Block API | ⚠️ Local only | ❌ |
| **Per-doc passwords** | ✅ | ❌ | ❌ | ✅ |
| **E2E encryption** | ✅ | ❌ | ❌ | ❌ |
| **Email lead gate** | ✅ | ❌ | ❌ | ✅ |
| **Reading analytics** | ✅ | ❌ | ❌ | ✅ |
| **Zero database** | ✅ | ❌ | ✅ | ❌ |
| **Self-hostable** | ✅ | ❌ | ✅ | ✅ |
| **Cost** | Free | $10/mo+ | $8/mo publish | $39/mo+ |

**PawPrint is the publishing layer.** You think in Obsidian, collaborate in Notion — and when you need to securely share a result, PawPrint is the simplest exit.

## 🛠️ Tech Stack

- **Frontend**: Pure HTML/CSS/JS + [marked.js](https://marked.js.org/) + [highlight.js](https://highlightjs.org/) + [Mermaid](https://mermaid.js.org/) + [Lucide Icons](https://lucide.dev/) (zero build step)
- **Backend**: Vercel Serverless Functions (Node.js)
- **Storage**: Vercel KV / Upstash Redis (optional, for analytics)
- **Fonts**: [Inter](https://rsms.me/inter/) + [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif)
- **PDF Export**: [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)
- **Deploy**: [Vercel](https://vercel.com) (free tier)

## 📄 License

MIT

---

**PawPrint** 🐾 — Leave your mark.
