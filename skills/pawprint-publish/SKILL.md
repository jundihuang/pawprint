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

### 0. Interactive Setup — Ask the user step by step

Do NOT ask all questions at once. Ask one at a time, suggest defaults based on context, and skip what's obvious.

**Step 1 — Content**: If user hasn't provided content, ask what to publish. If they gave a file or pasted content, confirm it.

**Step 2 — Title & Description**: Suggest a title based on the content. Ask if they want to change it.
> "标题我建议用「竞品分析：Z1 vs ClawMe」，描述用「Z1 竞品深度分析」，可以吗？"

**Step 3 — Category**: Suggest the most likely category based on content type:
> "这篇是调研报告，放到 **📂 项目** 分类可以吗？"
- 调研/报告/提案 → projects
- 流程/手册/规范 → areas
- 笔记/参考/指南 → resources
- 旧文档/已完成 → archives

**Step 4 — Protection** (ask as a single question with options):
> "需要设置什么保护吗？
> 1. 🔓 不设密码（站点密码内公开）
> 2. 🔒 设文档密码
> 3. 🛡️ 端到端加密（最高安全级别）
> 4. 📧 要求读者输入邮箱
> 5. 📜 要求签署 NDA
> 6. 🔥 限时过期（阅后即焚）
>
> 可以多选，比如 2+4 = 密码 + 邮箱收集"

**Step 5 — Confirm & Publish**:
Show a summary and ask for confirmation:
> "确认发布：
> - 📄 标题：竞品分析：Z1 vs ClawMe
> - 📂 分类：Projects
> - 🔒 密码：report2026
> - 📧 邮箱门控：开启
> - 发布？"

After user confirms, proceed to publish.

### Quick Publish Prompt

When the user triggers publish, send ONE message with numbered options. User replies with numbers to select:

```
📄 发布到 PawPrint

标题：{自动提取}
描述：{自动生成}

选择配置（回复数字，可多选如 1,3,5）：

1. 📂 项目  2. 📖 领域  3. 📚 资源  4. 📦 归档
5. 🔒 密码  6. 🛡️ E2E加密  7. 📧 邮箱收集
8. 📜 NDA签署  9. 🔥 限时过期  10. 👁‍🗨 一次性查看

默认：1（项目，无保护）→ 回复 ok 直接发布
```

#### Parse Rules
- "ok" / "发" → publish with default (category=projects, no protection)
- "3" → category=resources, no protection
- "1,5,7" → category=projects + password + email gate
- "2,6" → category=areas + E2E encryption
- "1,5,7,8,9" → projects + password + email + NDA + burn
- "3,10" → resources + one-time view (destroyed after first read)

#### Follow-up (only when needed)
After user selects, ask ONLY for items that need extra input:
- Selected 5 (password) → "密码设什么？"
- Selected 6 (E2E) → auto-generate key, no need to ask
- Selected 9 (burn) → "过期时间？1. 1小时  2. 24小时  3. 7天  4. 自定义"
- Selected 8 (NDA) → use default NDA text unless user specifies custom
- Selected 10 (one-time) → add `"oneTimeView": true`, warn user link dies after first view

Then confirm and publish. Maximum 2 round-trips total.

### Smart Defaults
- Auto-detect title from first `#` heading
- Auto-suggest category from content keywords (调研/报告 → projects, 手册/流程 → areas, 笔记/参考 → resources)
- Default: no extra protection (public within site gate)
- If user says "加密发布" → auto E2E, generate random key
- If user says "限时分享" → ask duration (1h/24h/7d), set expiresAt
- If user just says "ok" or "发" → publish immediately with defaults
- Target: **1 message to confirm, 1 reply to publish** for simple cases

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
- `encrypted` — set to `true` for E2E encrypted docs (see below)

### E2E Encrypted Documents

For sensitive documents, encrypt content client-side before publishing:

1. Write the markdown to a temp file
2. Run the encrypt script:
```bash
node skills/pawprint-publish/scripts/encrypt.js /tmp/doc.md docs/<category>/<slug>.md <secret-key>
```
3. In `docs.config.json`, add `"encrypted": true` to the doc entry
4. Share the link with key in fragment: `https://site.vercel.app/docs/<category>/<slug>#key=<secret-key>`

The key never touches the server. Only the encrypted blob is stored in Git.

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
