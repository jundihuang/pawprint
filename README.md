# 🐾 PawPrint

**Leave your mark.** — Private docs, public simplicity.

PawPrint is a lightweight, zero-database document sharing platform. Write in Markdown, set a password, push to Git — done.

🔗 **Demo**: [pawprint-jayce.vercel.app](https://pawprint-jayce.vercel.app)

---

## ✨ Features

- **📝 Markdown First** — Tables, code blocks, quotes, images — all render beautifully
- **🔒 Two-Layer Passwords** — Site-level gate + per-document passwords, all verified server-side
- **🔗 Direct Links** — Share any doc with a clean `#slug` URL
- **🚀 Git Push to Deploy** — Manage docs in Git, Vercel auto-deploys on push
- **💾 Zero Database** — Pure static files + serverless functions
- **📂 PARA Organization** — Docs organized by Projects, Areas, Resources, Archives
- **🧠 Password Memory** — Site password remembered 3 days, doc passwords 1 day (localStorage)
- **🆓 Free Forever** — Runs on Vercel's free tier, open source, self-hostable

## 🗂️ Project Structure

```
pawprint/
├── public/
│   ├── index.html        # Landing page (dark theme, parallax)
│   └── docs.html         # Doc browser (password-gated)
├── api/
│   ├── docs.js           # Doc list API (POST, site password required)
│   └── auth.js           # Doc content API (POST, per-doc password)
├── docs/                  # Your Markdown documents
│   ├── projects/          # Time-bound deliverables
│   ├── areas/             # Ongoing responsibilities
│   ├── resources/         # Reference materials
│   └── archives/          # Completed or inactive
├── skills/
│   └── pawprint-publish/  # OpenClaw AI agent skill for auto-publishing
├── docs.config.json       # Site config + document registry
├── vercel.json            # Vercel routing config
└── package.json
```

## 🚀 Quick Start

### 1. Clone & Configure

```bash
git clone https://github.com/user/pawprint.git
cd pawprint
```

### 2. Add Your First Document

Create a Markdown file in the appropriate category:

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
    { "id": "areas", "label": "Areas", "icon": "📖", "description": "Ongoing areas of responsibility" },
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

> **Password field is optional.** Omit it for public docs, or add `"password": "secret"` to lock individual docs.

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

> **Important**: If deploying via GitHub, make sure your git committer email matches a verified email on your GitHub account. Otherwise Vercel will reject the deployment.

### 5. Access

- **Home**: `https://your-app.vercel.app` — Landing page
- **Docs**: `https://your-app.vercel.app/docs` — Password-protected doc browser
- **Direct link**: `https://your-app.vercel.app/docs#hello` — Jump to a specific doc

## 📂 PARA Method

PawPrint uses the [PARA method](https://fortelabs.com/blog/para/) for organizing documents:

| Category | Folder | Use for |
|----------|--------|---------|
| 📂 Projects | `docs/projects/` | Time-bound deliverables (research, proposals, PRDs) |
| 📖 Areas | `docs/areas/` | Ongoing responsibilities (playbooks, processes) |
| 📚 Resources | `docs/resources/` | Reference material (guides, notes, collections) |
| 📦 Archives | `docs/archives/` | Completed or inactive content |

## 🔐 Security Model

| Layer | Scope | Verified | Memory |
|-------|-------|----------|--------|
| Site password | Entire `/docs` | Server-side (POST `/api/docs`) | 3 days (localStorage) |
| Doc password | Individual doc | Server-side (POST `/api/auth`) | 1 day (localStorage) |

- Passwords are **never exposed** in client-side JavaScript
- API requires POST method — no accidental GET leaks
- No cookies, no sessions, no tracking

## 🤖 AI Agent Integration (OpenClaw)

PawPrint includes an [OpenClaw](https://github.com/openclaw/openclaw) skill for AI-powered publishing. Any agent can publish docs to PawPrint with natural language:

> "Publish this research report to PawPrint under Projects"

The skill is located at `skills/pawprint-publish/` and includes:
- `SKILL.md` — Agent instructions
- `scripts/publish.sh` — One-command publish script
- `references/config-schema.md` — Config file reference

### Install the Skill

Copy the skill folder to your OpenClaw shared skills directory:

```bash
cp -r skills/pawprint-publish ~/.openclaw/skills/shared/
```

Then add to your OpenClaw config:

```json
{
  "skills": {
    "load": {
      "extraDirs": ["~/.openclaw/skills/shared"]
    }
  }
}
```

## 💡 Why PawPrint?

> Notion is a collaboration tool. Obsidian is a thinking tool. **PawPrint is a publishing tool** — and the only one AI agents can operate directly.

### In the Age of AI Agents

| | PawPrint | Notion | Obsidian |
|--|---------|--------|----------|
| **AI agent can publish** | ✅ `git push` | ❌ Complex block API | ⚠️ Local files, no sharing |
| **Publish workflow** | .md + JSON + push | API → create page → insert blocks | Write file → manual share |
| **Skill complexity** | ~10 lines bash | 200+ lines API calls | Depends on sync setup |
| **Per-doc passwords** | ✅ Independent | ❌ On/off only | ❌ |
| **Data ownership** | Your Git repo | Their servers | Local files |
| **Custom domain & brand** | ✅ | ❌ notion.site | ✅ (Publish $8/mo) |
| **Cost** | Free (Vercel) | Free limited, $10/mo+ | App free, Publish $8/mo |
| **Load speed** | Pure static, instant | SPA, heavy | Publish is OK |

### What PawPrint is NOT

PawPrint doesn't replace Notion or Obsidian. It doesn't do real-time collaboration, databases, kanban boards, or bidirectional linking.

**PawPrint is the publishing layer.** You think in Obsidian, collaborate in Notion — and when you need to securely share a result with the outside world, PawPrint is the simplest exit. Especially when an AI agent just finished a research report and can publish it with one command.

## 🛠️ Tech Stack

- **Frontend**: Pure HTML/CSS/JS + [marked.js](https://marked.js.org/) (zero build step)
- **Backend**: Vercel Serverless Functions (Node.js)
- **Fonts**: [Inter](https://rsms.me/inter/) + [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif)
- **Deploy**: [Vercel](https://vercel.com) (free tier)
- **Docs**: Git-managed Markdown files

## 📄 License

MIT

---

**PawPrint** 🐾 — Leave your mark.
