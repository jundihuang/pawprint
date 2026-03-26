# ClawMe Docs

轻量私密文档分享平台。

## 使用方法

### 添加新文档

1. 将 `.md` 文件放入 `docs/` 目录
2. 在 `docs.config.json` 中添加配置：

```json
{
  "slug": "my-doc",
  "title": "文档标题",
  "description": "简短描述",
  "file": "docs/my-doc.md",
  "password": "可选密码，不设则公开",
  "icon": "📄",
  "date": "2026-03-26",
  "author": "作者"
}
```

3. Git push → Vercel 自动部署

### 访问文档

- 文档列表：`https://your-domain.vercel.app`
- 直链某篇：`https://your-domain.vercel.app#slug`

### 密码说明

- 每篇文档可独立设密码
- 不设 `password` 字段则公开访问
- 密码验证走 Serverless Function，不暴露在前端

## 技术栈

- 前端：纯 HTML/CSS/JS + marked.js
- 后端：Vercel Serverless Functions (Node.js)
- 部署：Vercel
- 文档管理：Git
