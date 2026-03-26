# 🐾 PawPrint

[English](./README.md) | [中文](./README_zh.md) | [非技术用户指南](./GUIDE.md)

**留下你的爪印。** — 私密文档，极简分享。

PawPrint 是一个轻量级、零数据库的文档分享平台。用 Markdown 写文档，设个密码，Git push —— 搞定。

🔗 **演示**: [pawprint-jayce.vercel.app](https://pawprint-jayce.vercel.app)

---

## ✨ 特性

### 核心
- **📝 Markdown 优先** — 表格、代码块、引用、图片，开箱即用
- **🔒 两层密码** — 站点密码 + 文档独立密码，全部服务端验证
- **🔗 直链分享** — 无密码文档可绕过站点密码直接访问
- **🚀 Git Push 自动部署** — 用 Git 管理文档，Vercel 自动部署
- **💾 零数据库** — 纯静态文件 + Serverless 函数
- **📂 PARA 分类** — 按项目/领域/资源/归档组织，支持分类路由
- **🔍 搜索** — 实时过滤标题、描述、作者

### 安全与隐私
- **🛡️ E2E 加密** — 可选 AES-256-GCM 端到端加密，密钥在 URL fragment 中，不经过服务器
- **💧 动态水印** — 受保护文档自动叠加半透明水印（显示访问者邮箱/日期）
- **🔥 阅后即焚** — 设置 `expiresAt` 后文档到期自动消失（API 返回 410）
- **📧 邮箱门控** — 要求读者输入邮箱后才能访问（线索存入 KV）
- **🧠 密码记忆** — 站点密码记住 3 天，文档密码记住 1 天

### 阅读体验
- **📑 TOC 侧边栏** — 自动生成目录，滚动高亮
- **🎨 语法高亮** — highlight.js，跟随深色/浅色主题
- **📊 Mermaid 图表** — 流程图、序列图、饼图自动渲染
- **🌗 深色/浅色切换** — 偏好保存在 localStorage

### 数据分析
- **👁 阅读计数** — 每篇文档独立计数（Vercel KV）
- **📊 滚动深度** — 记录读者看到几%、停留多久
- **📧 线索收集** — 邮箱门控收集的邮箱列表
- **⚡ 活动流** — 谁看了什么、什么时候、从哪里
- **📈 Admin 仪表盘** — `/admin` 查看所有分析数据

### 导出
- **📥 PDF 下载** — 客户端生成 A4 格式 PDF
- **📄 MD 下载** — 导出原始 Markdown 源文件

### AI Agent
- **🤖 OpenClaw 技能** — AI Agent 用自然语言发布文档
- **🔐 加密发布** — Agent 可加密敏感文档后发布

## 🗂️ 项目结构

```
pawprint/
├── public/
│   ├── index.html        # 落地页（暗黑主题、视差滚动）
│   ├── docs.html         # 文档浏览器（密码门控）
│   └── admin.html        # 分析仪表盘
├── api/
│   ├── docs.js           # 文档列表 API
│   ├── auth.js           # 文档内容 API
│   ├── views.js          # 阅读计数 + 活动日志
│   ├── leads.js          # 邮箱线索存储
│   └── reading.js        # 滚动深度分析
├── docs/                  # 你的 Markdown 文档
│   ├── projects/          # 项目交付物
│   ├── areas/             # 持续关注的领域
│   ├── resources/         # 参考资料
│   └── archives/          # 已归档
├── skills/
│   └── pawprint-publish/  # OpenClaw AI Agent 技能
├── docs.config.json       # 站点配置 + 文档注册表
├── vercel.json            # Vercel 路由配置
├── CHANGELOG.md           # 完整版本历史
└── package.json
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/user/pawprint.git
cd pawprint
```

### 2. 添加文档

```bash
echo "# Hello World\n\n我的第一篇文档。" > docs/projects/hello.md
```

### 3. 注册到配置

编辑 `docs.config.json`：

```json
{
  "site": {
    "title": "我的文档",
    "description": "私密知识库",
    "password": "你的站点密码"
  },
  "categories": [
    { "id": "projects", "label": "项目", "icon": "📂" },
    { "id": "areas", "label": "领域", "icon": "📖" },
    { "id": "resources", "label": "资源", "icon": "📚" },
    { "id": "archives", "label": "归档", "icon": "📦" }
  ],
  "docs": [
    {
      "slug": "hello",
      "category": "projects",
      "title": "Hello World",
      "description": "第一篇文档",
      "file": "docs/projects/hello.md",
      "icon": "👋",
      "date": "2026-01-01",
      "author": "You"
    }
  ]
}
```

#### 文档配置字段

| 字段 | 必填 | 说明 |
|------|------|------|
| `slug` | ✅ | URL 标识符 |
| `category` | ✅ | `projects` / `areas` / `resources` / `archives` |
| `title` | ✅ | 显示标题 |
| `file` | ✅ | `.md` 文件路径 |
| `password` | | 文档密码（不填则公开） |
| `encrypted` | | `true` 启用 E2E 加密 |
| `expiresAt` | | ISO 日期，到期后文档失效 |
| `requireEmail` | | `true` 要求输入邮箱 |

### 4. 部署到 Vercel

**方式 A：GitHub 关联（推荐）**

1. 推到 GitHub
2. 打开 [vercel.com/new](https://vercel.com/new) → Import → Deploy
3. 以后每次 `git push` 自动部署

**方式 B：命令行**

```bash
npm i -g vercel && vercel --prod
```

> Git committer email 必须是 GitHub 已验证的邮箱。

### 5. 开启分析（可选）

Vercel Dashboard → 项目 → Storage → 创建 Upstash Redis → 自动注入环境变量 → Redeploy

### 6. 访问

| URL | 说明 |
|-----|------|
| `/` | 落地页 |
| `/docs` | 文档浏览器（需站点密码） |
| `/docs/projects` | 按分类筛选 |
| `/docs#slug` | 直链到文档 |
| `/admin` | 分析仪表盘 |

## 🔐 安全模型

| 层级 | 范围 | 方式 | 记忆 |
|------|------|------|------|
| 站点密码 | 整个 `/docs` | 服务端 POST | 3 天 |
| 文档密码 | 单篇文档 | 服务端 POST | 1 天 |
| E2E 加密 | 文档内容 | 客户端 AES-256-GCM | 密钥在 URL fragment |
| 邮箱门控 | 单篇文档 | 前端弹窗 → KV | 本次会话 |
| 动态水印 | 受保护文档 | CSS 叠加 | — |
| 阅后即焚 | 单篇文档 | 服务端到期检查 | — |

## 🤖 AI Agent 集成（OpenClaw）

```bash
cp -r skills/pawprint-publish ~/.openclaw/skills/shared/
```

OpenClaw 配置：

```json
{ "skills": { "load": { "extraDirs": ["~/.openclaw/skills/shared"] } } }
```

E2E 加密发布：

```bash
node skills/pawprint-publish/scripts/encrypt.js input.md docs/projects/secret.md "密钥"
# 分享：/docs/projects/secret#key=密钥
```

## 💡 为什么选 PawPrint？

> Notion 是协作工具，Obsidian 是思考工具，**PawPrint 是发布工具**——唯一一个 AI Agent 能直接操作的。

| | PawPrint | Notion | Obsidian | Papermark |
|--|---------|--------|----------|-----------|
| AI Agent 发布 | ✅ | ❌ | ⚠️ | ❌ |
| 独立密码 | ✅ | ❌ | ❌ | ✅ |
| E2E 加密 | ✅ | ❌ | ❌ | ❌ |
| 邮箱门控 | ✅ | ❌ | ❌ | ✅ |
| 阅读分析 | ✅ | ❌ | ❌ | ✅ |
| 零数据库 | ✅ | ❌ | ✅ | ❌ |
| 费用 | 免费 | $10/月+ | $8/月 | $39/月+ |

## 🛠️ 技术栈

- **前端**：纯 HTML/CSS/JS + marked.js + highlight.js + Mermaid + Lucide Icons
- **后端**：Vercel Serverless Functions (Node.js)
- **存储**：Vercel KV / Upstash Redis（可选，用于分析）
- **字体**：Inter + Instrument Serif
- **PDF**：html2pdf.js
- **部署**：Vercel（免费）

## 📄 开源协议

MIT

---

**PawPrint** 🐾 — 留下你的爪印。
