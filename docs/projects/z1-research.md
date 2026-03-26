# Z1 竞品调研报告（ClawMe 视角）

> **作者**：Lisa 📋（PM Agent）
> **日期**：2026-03-26
> **版本**：v2.0
> **说明**：ClawMe 是我们的产品，Z1 (Zalify) 是竞品

---

## 目录

1. [调研背景](#1-调研背景)
2. [我们的产品：ClawMe](#2-我们的产品clawme)
3. [竞品分析：Z1 (Zalify)](#3-竞品分析z1-zalify)
4. [深度对比](#4-深度对比)
5. [市场竞品格局](#5-市场竞品格局)
6. [战略建议](#6-战略建议)
7. [附录](#7-附录)

---

## 1. 调研背景

### 起因
Z1 (Zalify) 近期将新官网的 Google 广告跑起来，以咨询建站服务为转化目标，投放北美和澳洲。过了学习期后数据稳步攀升，并迎来首个 **$50K 澳洲建站咨询大单**。

Z1 的创始人公开分享了这一成绩和对 AI 建站市场的思考，引起了我们的关注。

### 核心命题
> "当创造东西的成本趋近于零，信任就是最稀缺的资源。"

### 调研目标
1. 深入了解竞品 Z1 的定位、功能和 GTM 策略
2. 对比我们 ClawMe 的优劣势
3. 为 ClawMe 产品迭代和市场策略提供决策依据

---

## 2. 我们的产品：ClawMe

### 2.1 产品定位

**ClawMe = AI 对话式建站工具**

用户通过聊天描述需求，AI 自动生成完整静态网站并部署到 `{username}.clawme.ai`，全程无需代码。

- 官网：clawme.ai
- Slogan：**"聊着天，就把个人网站做好了"** / *"Chat your way to a stunning personal page"*
- 状态：✅ 已上线运行

### 2.2 技术架构

#### 整体架构

```
Vue 3 SPA → Rails 7.2 API (SSE) → OpenClaw Builder Agent (Docker 沙箱)
  → 生成静态站 → /var/www/clawme-sites/
  → [site_ready] → SyncSiteToR2Job
  → Cloudflare R2 + Worker → 全球 CDN → {user}.clawme.ai
```

#### 技术栈

| 层 | 技术 |
|----|------|
| 前端 | Vue 3 + TypeScript + Vite + Pinia + vue-i18n |
| 后端 | Ruby on Rails 7.2 + Grape API |
| 数据库 | PostgreSQL |
| 任务队列 | Sidekiq + Redis |
| AI 引擎 | OpenClaw Builder Agent（Docker 沙箱） |
| 存储 | Cloudflare R2 + 阿里云 OSS |
| CDN | Cloudflare Worker + R2 |
| 支付 | Stripe（订阅制） |
| 部署 | Capistrano → VPS |
| 认证 | JWT + Google/Apple OAuth |

#### 技术亮点

1. **OpenClaw Agent 沙箱** — AI 在 Docker 中运行，有 VPS 文件系统权限，直接生成站点
2. **双 Agent 路由** — `clawme_builder`（个人站）vs `clawme_builder_enterprise`（企业站）
3. **多语言回译校验** — 翻译后自动回译对比，高危字段（产品名/价格/证书）需用户确认
4. **翻译记忆** — 已确认翻译对保存到用户记忆，下次自动复用
5. **多模态输入** — 支持文本 + 图片 + 文件上传
6. **Cloudflare 全家桶** — R2 存储 + Worker 路由 + CDN 全球加速

### 2.3 功能清单

| 功能 | 状态 |
|------|------|
| AI 对话建站 | ✅ |
| 流式响应（SSE） | ✅ |
| 多语言站点生成 + 回译校验 | ✅ |
| 图片/文件上传（多模态） | ✅ |
| 子域名托管 (`{user}.clawme.ai`) | ✅ |
| 自定义域名 + 自动 SSL | ✅ |
| CDN 加速 | ✅ |
| Guest 30 天免注册体验 | ✅ |
| Stripe 订阅支付 (Free/Pro) | ✅ |
| 企业站类型 | ✅ |
| Admin 后台 | ✅ |
| 历史对话记录 | ✅ |
| Google/Apple OAuth | ✅ |

### 2.4 商业模式

| 计划 | 说明 |
|------|------|
| Guest | 30 天免注册体验 |
| Free | 基础功能 |
| Pro | Stripe 月付/年付订阅 |

---

## 3. 竞品分析：Z1 (Zalify)

### 3.1 产品定位

**Z1 = AI Vibe Coding 营销型建站工具**

用自然语言描述需求，AI 自动生成专业的营销型网站。核心目标是**表单留资**，不是电商交易。

- 官网：zalify.com
- Slogan：**"Vibe code your interactive storefront"**
- 状态：⚠️ **Early Access，普通用户无法使用**

### 3.2 Zalify 公司背景

| 维度 | 信息 |
|------|------|
| 成立 | 2021 年 |
| 注册地 | Middletown, USA |
| 创始人 | RyanZ（@ry_zou），Co-Founder: Kevin Peng |
| Shopify 地位 | Premier Partner |
| App 评分 | ⭐ 4.5（82+ 评价） |
| App 安装 | ~1,471 |
| 服务数据 | 500+ 店上线、$200M+ GMV（官网声明） |
| 知名案例 | rabbit r1、Even Realities、UGREEN CES、CosyIsland |
| 开源贡献 | easy-email（拖拽邮件编辑器） |
| 融资 | 暂无公开融资记录 |

### 3.3 Zalify 产品矩阵

Z1 不是独立产品，而是 Zalify 生态的一部分：

| 产品 | 类型 | 核心功能 | 状态 |
|------|------|---------|------|
| **Z1** | AI Vibe Coding 建站 | 营销官网 + 表单留资 | ⚠️ Early Access |
| **Shopify App** | Shopify 营销插件 | Pixel 追踪、弹窗、邮件营销 | ✅ 已上线 |
| **ANA** | 数据分析 | 多渠道归因分析 | ✅ 已上线 |
| **Reach** | 获客工具 | 智能表单、邮件自动化 | ✅ 已上线 |
| **Enterprise** | 代建服务 | 团队代建 + 增长 | ✅ 已上线 |

### 3.4 Z1 核心特性

| 特性 | 说明 |
|------|------|
| Vibe Coding | 自然语言 → AI 生成完整网站 |
| 交互式落地页 | 类似 native app 体验 |
| 3D / 沉浸式 | 产品 3D 展示、旋转、缩放 |
| 全屏视频 | 首屏动态视频内容 |
| 表单留资 | 核心转化目标 |
| ANA 归因 | Google Ads, Meta, TikTok, GA4, Snapchat, Pinterest |
| Reach 再营销 | 表单 + 邮件自动化 |
| Shopify 集成 | 可对接 Shopify 结账 |

### 3.5 Z1 已验证的 GTM

```
Z1 自建官网 → Google PMAX 广告（北美+澳洲）→ 表单留资 → 建站咨询 → $50K 大单
```

这条链路本身就是 Z1 最好的案例：用 Z1 建的官网帮自己拿到了大单。

---

## 4. 深度对比

### 4.1 定位对比

| 维度 | ClawMe（我们） | Z1（竞品） |
|------|----------------|------------|
| **一句话** | AI 对话式建站工具 | AI 营销型官网生成器 |
| **目标用户** | 个人 / 自由职业者 / 小企业 | 品牌方 / 企业 / Builder |
| **网站类型** | 个人主页 + 企业介绍页 | 营销官网 / 品牌落地页 |
| **核心转化** | 个人展示 / 品牌形象 | 表单留资 → 商业咨询 |
| **产品状态** | ✅ 已上线 | ⚠️ Early Access |
| **市场** | 中英双语 | 全球（GTM 北美+澳洲） |

### 4.2 功能矩阵

| 功能 | ClawMe ✅/❌ | Z1 ✅/❌ | 备注 |
|------|:-----------:|:-------:|------|
| AI 自然语言建站 | ✅ | ✅ | 两者核心都是对话式 |
| 流式响应 | ✅ SSE | ✅（推测） | |
| 多语言站点 | ✅ + 回译校验 | ✅（推测） | **我们有回译校验优势** |
| 图片上传 | ✅ 多模态 | ✅（推测） | |
| 3D / 沉浸式展示 | ❌ | ✅ | **Z1 差异化亮点** |
| 全屏视频 | ❌ | ✅ | **Z1 差异化亮点** |
| 表单留资系统 | ❌ | ✅ 核心功能 | **Z1 核心优势** |
| 归因分析 | ❌ | ✅ ANA | Z1 有完整数据闭环 |
| 再营销 | ❌ | ✅ Reach | Z1 有邮件自动化 |
| Shopify 集成 | ❌ | ✅ | Z1 有 Shopify 生态 |
| 子域名托管 | ✅ | ✅（推测） | |
| 自定义域名 + SSL | ✅ | 未知 | **我们的亮点** |
| CDN 加速 | ✅ Cloudflare | 未知 | **我们的亮点** |
| Guest 免注册 | ✅ 30 天 | ❌ 需申请 | **我们的体验优势** |
| 订阅支付 | ✅ Stripe | 未知 | |
| 企业站类型 | ✅ | 仅营销型 | |
| Admin 后台 | ✅ | 未知 | |

### 4.3 商业模式对比

| 维度 | ClawMe | Z1 |
|------|--------|-----|
| 定价 | Free + Pro (Stripe) | 未公开 |
| 客单价 | 低（SaaS 订阅） | 高（$50K+ Enterprise） |
| 收入模式 | 纯 SaaS | 工具 + 高端代建 |
| 准入门槛 | Guest 即体验 | 需申请 Early Access |
| 变现节奏 | 高频低价 | 低频高价 |

### 4.4 技术对比

| 维度 | ClawMe | Z1 |
|------|--------|-----|
| 前端 | Vue 3 + TS + Vite | 未知（推测 React/Next.js） |
| 后端 | Rails 7.2 + Grape | 未知 |
| AI 引擎 | OpenClaw Agent (Docker) | 自研（推测） |
| 生成物 | 纯静态站（HTML/CSS/JS） | 交互式页面（3D/视频） |
| 托管 | Cloudflare R2 + Worker | 未知 |
| 自定义域名 | ✅ DNS + Nginx + LE | 未知 |

---

## 5. 市场竞品格局

### 5.1 我们（ClawMe）的竞品

| 竞品 | 类型 | 对比 |
|------|------|------|
| **Z1 (Zalify)** | AI vibe coding 营销型建站 | 偏高端，表单留资，还在内测 |
| **Carrd** | 单页建站 | 无 AI，手动设计 |
| **About.me** | 个人主页 | 功能单一 |
| **Linktree / Bento** | 链接聚合 | 不是完整网站 |
| **Wix AI** | AI 建站 | 比我们重，不够轻量 |
| **CodeDesign.ai** | AI vibe coding 建站 | 最接近的竞品 |
| **vibehtml.com** | AI 生成 Tailwind 页面 | 轻量但没有数据闭环 |

### 5.2 Z1 的竞品（营销型建站赛道）

| 竞品 | 价格 |
|------|------|
| **Webflow** | $14-39/月 |
| **Framer** | $5-30/月 |
| **Unbounce** | $64-625/月 |
| **Leadpages** | $37-74/月 |
| **Instapage** | $79-239/月 |

### 5.3 关键洞察

**ClawMe 和 Z1 不在同一个竞争维度**，但存在潜在交叉：

```
ClawMe → "快速有个专业网站" → 个人/小企业 → 低客单价、高频
Z1     → "高转化营销官网"    → 品牌/企业  → 高客单价、低频
```

如果我们向上做营销型站点 → 会直接与 Z1 竞争。
如果 Z1 向下做轻量个人站 → 会直接与我们竞争。

---

## 6. 战略建议

### 6.1 我们的优势（要保持）

1. **已上线可用** — Z1 还在内测，我们已有真实用户
2. **低门槛** — Guest 30 天免注册，对话即建站，转化漏斗更短
3. **多语言回译校验** — 跨境场景差异化，Z1 没有
4. **自定义域名** — 完整的域名绑定 + 自动 SSL + CDN
5. **技术成熟** — 架构清晰，测试完善，部署自动化
6. **双 Agent 架构** — personal + enterprise 灵活切换

### 6.2 我们的短板（要补）

1. ❌ **无表单留资系统** — Z1 的核心能力，营销场景必需
2. ❌ **无归因分析** — Z1 有 ANA，能追踪广告效果
3. ❌ **无再营销** — Z1 有 Reach，能做邮件自动化
4. ❌ **无 3D/视频** — 生成物是纯静态站，视觉冲击力不如 Z1
5. ❌ **无知名案例** — Z1 有 rabbit r1、UGREEN 等品牌背书
6. ⚠️ **单 VPS 架构** — 自定义域名不走 CDN，有性能瓶颈

### 6.3 Z1 值得警惕的地方

1. **Shopify 生态护城河** — Premier Partner + 500+ 案例 + $200M GMV
2. **建站→归因→再营销全闭环** — 不只是建站工具，是增长平台
3. **Enterprise 高端代建** — $50K 客单价已验证
4. **GTM 已跑通** — Google Ads 投放链路闭环

### 6.4 Z1 的弱点（我们的机会）

1. ⚠️ **还在内测** — 时间窗口在我们这边
2. ⚠️ **门槛高** — 需申请才能用，我们 Guest 即可体验
3. ⚠️ **Shopify 绑定** — 非 Shopify 用户怎么办？
4. ⚠️ **定价不透明** — 可能让普通用户望而却步

### 6.5 建议行动项

**短期（守住优势）**：
- [ ] 持续优化对话建站体验，提升生成网站质量
- [ ] 积累和展示用户案例（我们的"信任建设"）
- [ ] 扩大 Guest 体验的转化率

**中期（补齐短板）**：
- [ ] 考虑加入**表单留资**能力（进入营销场景）
- [ ] 考虑基础的**数据追踪**（访客数、表单提交数）
- [ ] 提升生成站点的视觉丰富度（动画、视频嵌入）

**长期（差异化）**：
- [ ] 多语言回译校验做深做透，成为跨境建站首选
- [ ] 探索 Enterprise 代建模式（参考 Z1 的 $50K 大单路径）
- [ ] 自定义域名走 CDN，提升全球访问性能

---

## 7. 附录

### 7.1 数据来源

| 来源 | 说明 |
|------|------|
| github.com/beansmile/clawme | ClawMe 完整源码（我们的代码库） |
| zalify.com 官网 | Z1 产品信息（Web Fetch） |
| apps.shopify.com/zalify | Shopify App 评分和评价 |
| clawme.ai | ClawMe 官网 |
| Tracxn, Storeleads | 公司和安装量数据 |
| Brave Search | 竞品和行业信息 |

### 7.2 项目文件

| 文件 | 路径 |
|------|------|
| Z1 调研报告 | `/home/openclaw/projects/调研-z1/pm/notes/2026-03-26-z1-research.md` |
| ClawMe 代码分析 | `/home/openclaw/projects/clawme/pm/notes/2026-03-26-code-analysis.md` |
| Z1 vs ClawMe 对比 | `/home/openclaw/projects/调研-z1/pm/notes/2026-03-26-z1-vs-clawme.md` |

### 7.3 团队 Thread

| 频道 | Thread | 任务 |
|------|--------|------|
| #backend | ClawMe | 后端架构分析 |
| #frontend | ClawMe | 前端交互分析 |
| #designer | ClawMe | 设计语言分析 |

---

*报告由 Lisa 📋 (PM Agent) 生成。Z1 信息基于公开网络信息和官网描述，标注"推测"处待进一步验证。ClawMe 信息基于源码分析。*
