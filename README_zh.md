# 🐾 PawPrint

[English](./README.md) | [中文](./README_zh.md)

**留下你的爪印。** — 私密文档，极简分享。

PawPrint 是一个轻量级、零数据库的文档分享平台。用 Markdown 写文档，设个密码，Git push —— 搞定。

🔗 **演示**: [pawprint-jayce.vercel.app](https://pawprint-jayce.vercel.app)

---

## ✨ 特性

- **📝 Markdown 优先** — 表格、代码块、引用、图片，开箱即用
- **🔒 两层密码** — 站点密码 + 文档独立密码，全部服务端验证
- **🔗 直链分享** — 每篇文档一个干净的 `#slug` 链接
- **🚀 Git Push 自动部署** — 用 Git 管理文档，Vercel 自动部署
- **💾 零数据库** — 纯静态文件 + Serverless 函数
- **📂 PARA 分类法** — 按项目、领域、资源、归档组织文档
- **🧠 密码记忆** — 站点密码记住 3 天，文档密码记住 1 天（localStorage）
- **🆓 永久免费** — 跑在 Vercel 免费套餐上，开源，可自部署

## 🗂️ 项目结构

```
pawprint/
├── public/
│   ├── index.html        # 落地页（暗黑主题、视差滚动）
│   └── docs.html         # 文档浏览器（密码门控）
├── api/
│   ├── docs.js           # 文档列表 API（POST，需站点密码）
│   └── auth.js           # 文档内容 API（POST，需文档密码）
├── docs/                  # 你的 Markdown 文档
│   ├── projects/          # 项目交付物
│   ├── areas/             # 持续关注的领域
│   ├── resources/         # 参考资料
│   └── archives/          # 已完成/归档
├── skills/
│   └── pawprint-publish/  # OpenClaw AI Agent 发布技能
├── docs.config.json       # 站点配置 + 文档注册表
├── vercel.json            # Vercel 路由配置
└── package.json
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/user/pawprint.git
cd pawprint
```

### 2. 添加第一篇文档

在对应分类目录下创建 Markdown 文件：

```bash
echo "# Hello World\n\n我的第一篇私密文档。" > docs/projects/hello.md
```

### 3. 注册到配置文件

编辑 `docs.config.json`：

```json
{
  "site": {
    "title": "我的文档",
    "description": "私密知识库",
    "password": "你的站点密码"
  },
  "categories": [
    { "id": "projects", "label": "项目", "icon": "📂", "description": "有时效性的项目交付物" },
    { "id": "areas", "label": "领域", "icon": "📖", "description": "持续关注的领域" },
    { "id": "resources", "label": "资源", "icon": "📚", "description": "参考资料" },
    { "id": "archives", "label": "归档", "icon": "📦", "description": "已完成或不活跃" }
  ],
  "docs": [
    {
      "slug": "hello",
      "category": "projects",
      "title": "Hello World",
      "description": "我的第一篇文档",
      "file": "docs/projects/hello.md",
      "icon": "👋",
      "date": "2026-01-01",
      "author": "You"
    }
  ]
}
```

> **密码字段可选。** 不填就是公开文档，填了 `"password": "secret"` 就是加密文档。

### 4. 部署到 Vercel

**方式 A：GitHub 关联自动部署（推荐）**

1. 将仓库推到 GitHub
2. 打开 [vercel.com/new](https://vercel.com/new)
3. 点 **"Import Git Repository"** → 选择你的 PawPrint 仓库
4. 保持所有默认配置（不需要框架、不需要构建命令）→ 点 **Deploy**
5. 完成。以后每次 `git push` 到 `main` 都会自动部署

**方式 B：命令行部署**

```bash
npm i -g vercel
vercel          # 首次使用：关联项目
vercel --prod   # 部署到生产环境
```

> **注意**：通过 GitHub 部署时，你的 Git committer email 必须是 GitHub 账号已验证的邮箱，否则 Vercel 会拒绝部署。

### 5. 访问

- **首页**：`https://your-app.vercel.app` — 落地页
- **文档**：`https://your-app.vercel.app/docs` — 密码保护的文档浏览器
- **直链**：`https://your-app.vercel.app/docs#hello` — 跳转到指定文档

## 📂 PARA 分类法

PawPrint 使用 [PARA 方法](https://fortelabs.com/blog/para/) 组织文档：

| 分类 | 目录 | 用途 |
|------|------|------|
| 📂 项目 | `docs/projects/` | 有时效性的交付物（调研、提案、PRD） |
| 📖 领域 | `docs/areas/` | 持续关注的领域（操作手册、流程文档） |
| 📚 资源 | `docs/resources/` | 参考资料（指南、笔记、合集） |
| 📦 归档 | `docs/archives/` | 已完成或不再活跃的内容 |

## 🔐 安全模型

| 层级 | 范围 | 验证方式 | 记忆时长 |
|------|------|----------|----------|
| 站点密码 | 整个 `/docs` | 服务端验证（POST `/api/docs`） | 3 天（localStorage） |
| 文档密码 | 单篇文档 | 服务端验证（POST `/api/auth`） | 1 天（localStorage） |

- 密码**绝不暴露**在前端 JavaScript 中
- API 仅接受 POST 请求 — 不会被 GET 意外泄露
- 无 Cookie、无 Session、无追踪

## 🤖 AI Agent 集成（OpenClaw）

PawPrint 内置了 [OpenClaw](https://github.com/openclaw/openclaw) 技能，AI Agent 可以用自然语言发布文档：

> "把这份调研报告发布到 PawPrint 的项目分类下"

技能位于 `skills/pawprint-publish/`，包含：
- `SKILL.md` — Agent 指令
- `scripts/publish.sh` — 一键发布脚本
- `references/config-schema.md` — 配置文件参考

### 安装技能

将 skill 文件夹复制到 OpenClaw 共享技能目录：

```bash
cp -r skills/pawprint-publish ~/.openclaw/skills/shared/
```

然后在 OpenClaw 配置中添加：

```json
{
  "skills": {
    "load": {
      "extraDirs": ["~/.openclaw/skills/shared"]
    }
  }
}
```

## 💡 为什么选 PawPrint？

> Notion 是协作工具，Obsidian 是思考工具，**PawPrint 是发布工具** — 而且是唯一一个 AI Agent 能直接操作的发布工具。

### AI Agent 时代的文档分享

| | PawPrint | Notion | Obsidian |
|--|---------|--------|----------|
| **AI Agent 可发布** | ✅ `git push` 就行 | ❌ 复杂的 Block API | ⚠️ 本地文件，无法分享 |
| **发布流程** | .md + JSON + push | 调 API → 创建页面 → 逐个插入 block | 写文件 → 手动分享 |
| **技能复杂度** | ~10 行 bash | 200+ 行 API 调用 | 取决于同步方案 |
| **独立文档密码** | ✅ 每篇独立 | ❌ 只有开/关 | ❌ |
| **数据所有权** | 你的 Git 仓库 | 他们的服务器 | 本地文件 |
| **自定义域名和品牌** | ✅ | ❌ notion.site | ✅（Publish $8/月） |
| **费用** | 免费（Vercel） | 免费版有限，$10/月起 | App 免费，Publish $8/月 |
| **加载速度** | 纯静态，极快 | SPA，较重 | Publish 还行 |

### PawPrint 不做什么

PawPrint 不替代 Notion 或 Obsidian。它不做实时协作、数据库、看板、双向链接。

**PawPrint 是发布层。** 你在 Obsidian 里思考，在 Notion 里协作 — 当你需要把成果**安全地分享给外部**时，PawPrint 是最简单的出口。尤其是当 AI Agent 刚帮你写完调研报告，一句话就能发布。

## 🛠️ 技术栈

- **前端**：纯 HTML/CSS/JS + [marked.js](https://marked.js.org/)（零构建步骤）
- **后端**：Vercel Serverless Functions (Node.js)
- **字体**：[Inter](https://rsms.me/inter/) + [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif)
- **部署**：[Vercel](https://vercel.com)（免费套餐）
- **文档**：Git 管理的 Markdown 文件

## 📄 开源协议

MIT

---

**PawPrint** 🐾 — 留下你的爪印。
