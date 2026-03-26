# Changelog

All notable changes to PawPrint are documented here.

## [0.9.0] - 2026-03-26

### 🎉 Project Init → Feature Complete in One Day

---

### Added

#### Core Platform
- **Markdown Document Sharing** — Write `.md` files, push to Git, auto-deploy on Vercel
- **Two-Layer Password System** — Site-level gate + per-document independent passwords
- **Serverless API** — `/api/docs` (doc list) + `/api/auth` (doc content), all server-side verified
- **Zero Database Architecture** — Pure static files + Vercel Serverless Functions

#### Landing Page
- Dark-theme home page at `/` with Inter + Instrument Serif fonts
- Liquid glass UI effects, parallax scrolling, staggered fade-in animations
- Feature showcase section, testimonial with scroll-driven word reveal
- CTA section "Ready to leave your mark?"

#### Document Organization
- **PARA Method** — Documents organized into Projects, Areas, Resources, Archives
- **Category Routing** — `/docs/projects`, `/docs/areas`, etc. with tab navigation
- **Search** — Real-time filtering by title, description, author, slug
- **TOC Sidebar** — Auto-generated from headings, scroll spy with active highlight

#### Security & Privacy
- **E2E Encryption** — Optional AES-256-GCM encryption per document
  - Client-side encrypt/decrypt via Web Crypto API
  - Decryption key in URL fragment (`#key=xxx`) — never touches server
  - Node.js encrypt script for Agent publishing
  - Custom decrypt modal with error handling
- **Dynamic Watermark** — Semi-transparent overlay on protected docs showing viewer email/date
- **Burn-After-Time** — Documents with `expiresAt` auto-expire (API returns 410 Gone)
- **Direct Link Bypass** — Non-password docs accessible via direct link without site gate

#### Analytics & Tracking
- **View Counter** — Per-document read count stored in Vercel KV (Upstash Redis)
- **Vercel Web Analytics** — Page views + Speed Insights
- **Reading Depth Tracking** — Scroll depth %, reading duration, reported via sendBeacon
- **Email Lead Collection** — `requireEmail` gate collects viewer emails before access
- **Activity Log** — Recent view events with viewer email, IP, user agent, timestamp
- **Admin Dashboard** — `/admin` with password auth, stats cards, activity feed, leads table, reading depth analysis

#### Export
- **PDF Download** — Client-side PDF generation via html2pdf.js (A4 format)
- **Markdown Download** — Raw `.md` file export

#### UX Polish
- **Dark/Light Theme Toggle** — Persisted in localStorage, affects all components
- **Lucide Icons** — Replaced all emoji with clean SVG icons
- **Syntax Highlighting** — highlight.js with theme-aware light/dark styles
- **Mermaid Diagrams** — Auto-detected `mermaid` code blocks rendered as diagrams
- **Password Memory** — Site password remembered 3 days, doc passwords 1 day (localStorage)
- **Branded Loading Screen** — Animated paw print pulse instead of text
- **Anchor Link Fix** — In-doc links scroll smoothly instead of changing URL

#### AI Agent Integration
- **OpenClaw Skill** — `pawprint-publish` skill for AI-powered document publishing
  - Natural language publishing: "发布到 PawPrint"
  - One-command publish script (`publish.sh`)
  - E2E encryption script (`encrypt.js`)
  - Config schema reference
  - Installed in shared skills directory for all agents

#### Documentation
- **README.md** — Full English documentation with Quick Start, PARA method, security model
- **README_zh.md** — Complete Chinese translation
- **Why PawPrint** — Positioning vs Notion/Obsidian comparison
- **Vercel Deploy Guide** — Step-by-step GitHub + CLI deployment instructions

### Infrastructure
- GitHub repository: `jundihuang/pawprint-jayce` (private, pre-open-source)
- Vercel auto-deploy on push to `main`
- Vercel KV (Upstash Redis) for view counts, leads, reading analytics
- CommonJS API functions (ESM compilation was breaking file reads)

---

## [0.0.1] - 2026-03-26

### Added
- Initial project: ClawMe Docs — lightweight private document sharing
- Basic Markdown rendering with marked.js
- Per-document password protection
- Card-style document list
- Vercel deployment

---

*PawPrint 🐾 — Leave your mark.*
