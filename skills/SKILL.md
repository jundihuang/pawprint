---
name: pawprint-publish
description: "Publish Markdown documents to PawPrint (pawprint-jayce.vercel.app). Use when a user says 'publish to PawPrint', 'add to PawPrint', 'share this doc on PawPrint', or wants to publish any Markdown file/content to the private doc sharing platform. Handles adding docs to config, committing, and pushing to trigger Vercel auto-deploy."
---

# PawPrint Publish

Publish Markdown documents to the PawPrint private doc sharing platform.

## Repository

- Local path: `/tmp/clawme-docs/`
- Remote: `github.com/jundihuang/pawprint-jayce` (private)
- Branch: `main`
- Deploy: Vercel auto-deploys on push → `pawprint-jayce.vercel.app`

## PARA Categories

Docs are organized by PARA method. Choose the right category:

| Category | ID | Use when |
|----------|-----|----------|
| 📂 Projects | `projects` | Time-bound deliverables (PRDs, research, proposals) |
| 📖 Areas | `areas` | Ongoing responsibilities (playbooks, processes) |
| 📚 Resources | `resources` | Reference material (guides, notes, collections) |
| 📦 Archives | `archives` | Completed or inactive content |

## Publish Workflow

### 1. Prepare the Markdown file

Place the `.md` file in the correct category subdirectory:

```
docs/
├── projects/    # time-bound
├── areas/       # ongoing
├── resources/   # reference
└── archives/    # inactive
```

File path pattern: `docs/<category>/<slug>.md`

### 2. Update docs.config.json

Read the current config, then append to the `docs` array:

```json
{
  "slug": "<url-friendly-slug>",
  "category": "<projects|areas|resources|archives>",
  "title": "<Document Title>",
  "description": "<One-line description>",
  "file": "docs/<category>/<slug>.md",
  "password": "<optional — omit for public access>",
  "icon": "<emoji>",
  "date": "<YYYY-MM-DD>",
  "author": "<Author Name>"
}
```

Rules:
- `slug` must be URL-safe (lowercase, hyphens, no spaces)
- `password` is optional — omit the field entirely for public docs
- `icon` should be a single emoji that represents the content
- Always read the existing config first — never overwrite it

### 3. Commit and push

```bash
cd /tmp/clawme-docs
git add -A
git commit -m "docs: add <slug> to <category>"
git push
```

Git config must use `jayce9210@gmail.com` as committer email (required for Vercel deployment).

### 4. Verify deployment

Wait ~20 seconds, then check deployment status:

```bash
curl -s "https://api.vercel.com/v6/deployments?limit=1" \
  -H "Authorization: Bearer $VERCEL_TOKEN" | python3 -c "
import json,sys; d=json.load(sys.stdin)['deployments'][0]; print(d['name'], d['state'])"
```

Expected: `pawprint-jayce READY`

## Access

- Home: `https://pawprint-jayce.vercel.app`
- Docs: `https://pawprint-jayce.vercel.app/docs` (site password required)
- Direct link: `https://pawprint-jayce.vercel.app/docs#<slug>`

## Auth

- Site password: stored in `docs.config.json` → `site.password`
- Per-doc password: stored in each doc's `password` field
- Passwords verified server-side via `/api/auth` and `/api/docs`

## Credentials

The Vercel token is needed for deployment verification. Check if it's available as an environment variable or ask the user.

GitHub auth: `gh` CLI is configured for `jundihuang` account.
