# 🐾 PawPrint

**留下你的爪印。** — 私密文档，极简分享。

[English](#-what-is-pawprint) | [开发者文档](./DEVELOPER.md) | [Developer Docs (EN)](./DEVELOPER.md)

---

## 🐾 PawPrint 是什么？

PawPrint 是一个**私密文档分享工具**。

你写好一篇文档 → 设个密码 → 发个链接给别人 → 对方输入密码就能看。

就这么简单。没有注册、没有登录、没有月费。

**最特别的是：** 任何 AI 工具都能帮你发布文档 —— 无论是 [OpenClaw](https://github.com/openclaw/openclaw)、Claude Code、Cursor、Windsurf、ChatGPT，还是直接写 Markdown 手动 push。PawPrint 不绑定任何平台。

🔗 **体验一下**: [pawprint-jayce.vercel.app](https://pawprint-jayce.vercel.app)

---

## ✨ 能做什么？

| 功能 | 说明 |
|------|------|
| 📝 **写文档** | 用 Markdown 写，表格、代码、图表都支持 |
| 🔒 **设密码** | 每篇文档可以设独立密码 |
| 🛡️ **端到端加密** | 敏感文档可以加密，连服务器都看不到内容 |
| 🔥 **阅后即焚** | 设定时间后文档自动消失 |
| 📧 **收集邮箱** | 要求读者输入邮箱才能看，自动收集线索 |
| 💧 **防截图水印** | 受保护的文档自动加上半透明水印 |
| 📜 **NDA 签署** | 要求读者签署保密协议后才能看文档 |
| 📊 **阅读分析** | 知道谁看了、看了多久、看到哪里 |
| 📥 **下载导出** | 一键导出 PDF 或 Markdown 原文件 |
| 🌗 **深色/浅色** | 切换阅读主题 |
| 🤖 **AI 发布** | 告诉 Agent 一句话，它帮你发布 |

---

## 🚀 怎么开始？

### 如果你有 AI 助手（推荐）

不管你用的是 OpenClaw、Claude Code、Cursor 还是其他 AI 工具，直接告诉它：

> **"帮我搭建一个 PawPrint 文档分享站。"**

Agent 会一步步引导你完成。你需要提前准备好以下账号和权限：

### 1️⃣ GitHub 账号 + Token

PawPrint 的文档存在 GitHub 仓库里。Agent 需要一个 Token 才能帮你创建仓库和推送文档。

1. 注册/登录 [github.com](https://github.com)（免费）
2. 打开 [github.com/settings/tokens](https://github.com/settings/tokens?type=beta)
3. 点 **"Generate new token"** → **Fine-grained token**
4. 设置：
   - Token name：`pawprint`
   - Expiration：选 90 天或更长
   - Repository access：**All repositories**
   - Permissions → Repository permissions：
     - **Contents**: Read and write
     - **Metadata**: Read-only
5. 点 **Generate token** → 复制 token（以 `github_pat_` 开头）
6. 在 OpenClaw 的服务器上运行：
   ```
   echo "你的token" | gh auth login --with-token
   ```
   或者直接告诉 Agent："帮我配置 GitHub token"，把 token 发给它。

### 2️⃣ Vercel 账号 + Token

Vercel 让你的 PawPrint 变成一个可以访问的网址（比如 `your-docs.vercel.app`）。

1. 打开 [vercel.com](https://vercel.com) → 用 GitHub 账号登录（一键）
2. 打开 [vercel.com/account/tokens](https://vercel.com/account/tokens)
3. 点 **Create** → 名字填 `pawprint` → 点 **Create Token**
4. 复制 token（以 `vcp_` 开头）
5. 把 token 发给 Agent

### 3️⃣ 告诉 Agent 开始搭建

把 GitHub 和 Vercel 的 token 都准备好后，告诉 Agent：

> "帮我搭建 PawPrint，GitHub token 是 xxx，Vercel token 是 xxx。"

Agent 会自动：
- ✅ 创建 GitHub 私有仓库
- ✅ 部署到 Vercel
- ✅ 配置自动部署（以后 push 自动更新）
- ✅ 安装 PawPrint 发布技能
- ✅ 给你一个可访问的网址

> ⚠️ **安全提醒：** Token 只需要提供一次。Agent 配置好后会存在服务器上，以后不需要再给。不要把 token 发到公开群聊里。

### 如果你是开发者

请看 [开发者文档 (DEVELOPER.md)](./DEVELOPER.md)，里面有完整的技术细节。

---

## 📖 日常使用

所有操作都可以通过跟 Agent 对话完成：

### 发布文档

> "把这篇调研报告发布到 PawPrint，放到项目分类，密码设 report2026。"

Agent 会自动发布并给你分享链接。

### 加密发布

> "用端到端加密发布这篇文档，密钥是 topsecret。"

生成的链接自带密钥，只有拿到链接的人才能看。

### 限时分享

> "发布这篇文档，48 小时后自动过期。"

过期后链接自动失效。

### 收集线索

> "发布这篇白皮书，要求读者输入邮箱才能看。"

读者的邮箱会自动收集到你的后台。

### 查看数据

> "查看 PawPrint 的阅读数据。"

或者直接打开你的网址后面加 `/admin`（比如 `your-site.vercel.app/admin`），输入站点密码就能看到分析仪表盘。

---

## 📂 文档怎么分类？

PawPrint 用 **PARA 方法**组织文档，4 个分类：

| 分类 | 放什么 | 举例 |
|------|--------|------|
| 📂 **项目** | 有截止日期的事 | 调研报告、提案、竞品分析 |
| 📖 **领域** | 持续维护的内容 | 操作手册、流程文档 |
| 📚 **资源** | 参考资料 | 学习笔记、工具清单 |
| 📦 **归档** | 已完成的东西 | 旧报告、过期方案 |

发布时告诉 Agent 放哪个分类就行。

---

## 🔐 安全说明

| 保护方式 | 怎么用 | 安全级别 |
|----------|--------|---------|
| **站点密码** | 整个文档站需要密码才能进入 | ⭐⭐ |
| **文档密码** | 每篇文档独立密码 | ⭐⭐⭐ |
| **端到端加密** | 文档内容加密，连服务器都看不到 | ⭐⭐⭐⭐⭐ |
| **邮箱门控** | 读者必须留邮箱才能看 | ⭐⭐ |
| **水印** | 截图也能追溯到谁泄露的 | ⭐⭐⭐ |
| **限时过期** | 到时间自动销毁 | ⭐⭐⭐⭐ |

所有密码在服务器端验证，不会暴露在浏览器里。
端到端加密的密钥**永远不经过服务器**。

---

## 💰 要花钱吗？

**不花钱。** 完全免费。

- GitHub：免费
- Vercel：免费套餐足够用
- PawPrint：开源，MIT 协议
- 分析功能（可选）：Upstash Redis 免费套餐，每天 3000 次请求

---

## 💡 跟其他工具有什么不同？

| | PawPrint | Notion | Google Docs | 微信发文件 |
|--|---------|--------|-------------|-----------|
| 需要对方注册 | ❌ 不需要 | ✅ 要 | ✅ 要 | ❌ |
| 独立密码 | ✅ 每篇不同 | ❌ | ❌ | ❌ |
| 加密 | ✅ 端到端 | ❌ | ❌ | ❌ |
| 知道谁看了 | ✅ | ❌ | ✅ 有限 | ❌ |
| 自动过期 | ✅ | ❌ | ❌ | ❌ |
| AI 直接发布 | ✅ | ❌ | ❌ | ❌ |
| 费用 | 免费 | $10/月起 | 免费 | 免费 |

**一句话总结：** PawPrint 是最简单的"写完→加密→分享→追踪"工具。

---

## ❓ 常见问题

**Q: 我需要会编程吗？**
不需要。如果你用 OpenClaw，所有操作都是跟 AI 对话完成的。

**Q: 手机能看吗？**
可以，文档页面自适应移动端。

**Q: 能自定义网址吗？**
可以。在 Vercel 设置里绑定你自己的域名（比如 `docs.你的公司.com`）。

**Q: 文档存在哪里？**
存在你自己的 GitHub 私有仓库里。只有你能访问。

**Q: 有人数限制吗？**
没有。想分享给多少人就分享给多少人。

**Q: 能用来做什么？**
- 给客户发提案/报告
- 团队内部文档分享
- 收集潜在客户邮箱
- 分享敏感资料（合同、方案、数据）
- AI Agent 自动生成并发布研究报告

---

## 🤝 对话示例

```
你：把今天的竞品分析发布到 PawPrint，密码设 report2026
🤖：✅ 已发布！链接：https://your-site.vercel.app/docs#competitor-analysis

你：这篇需要对方输入邮箱才能看
🤖：✅ 已更新，读者需要输入邮箱后才能访问。

你：昨天的文档有人看了吗？
🤖：有！jayce@example.com 看了竞品分析，阅读深度 85%，停留 3 分钟。

你：帮我把那篇文档设成 48 小时后过期
🤖：✅ 已设置，文档将在后天 20:00 自动失效。

你：这篇合同方案需要对方先签 NDA 才能看
🤖：✅ 已开启 NDA 门控，读者必须同意保密协议后才能访问。

你：用端到端加密发一篇新文档
🤖：✅ 已加密发布。分享链接（含密钥）：
     https://your-site.vercel.app/docs/projects/secret#key=abc123
     只有拿到这个完整链接的人才能解密查看。
```

---

**PawPrint** 🐾 — 留下你的爪印。
