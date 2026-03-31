# ClawHost 生图功能方案

> **项目:** ClawHost (haixia.ai)  
> **日期:** 2026-03-31  
> **状态:** MVP 方案确认，待开发  
> **作者:** Lisa (PM)

---

## 1. 背景

旧版海虾（Lobster）已实现基于 Gemini API 的 AI 生图和短视频生成能力。现需将生图能力迁移到新版 ClawHost 平台，作为 **SaaS 付费功能** 提供给用户。

### 旧版参考

| 模块 | 文件 | 说明 |
|------|------|------|
| 生图 | `nanobot/agent/tools/image_gen.py` | Gemini 生图，通过 Spear Proxy |
| 生视频 | `nanobot/agent/tools/video_gen.py` | EdgeTTS + Pexels + ffmpeg |

### 为什么不用 MJ Proxy

- Midjourney 无官方 API，依赖 Discord Bot 代理
- 封号风险高，速率不可控，依赖链长
- Gemini 原生生图（Nano Banana）质量已接近 MJ，且有官方 API

---

## 2. 技术方案

### 2.1 架构

```
用户对话框 → Agent Tool (generate_image)
  → ClawHost API (POST /api/media/generate)
  → 鉴权 + 每日限额检查 + 扣费
  → 直连 Gemini API (我们的 Key)
  → 返回图片 → 对话框展示
```

**关键决策：**
- ✅ 直连 Gemini API（不走 Spear Proxy），减少依赖
- ✅ API Key 由 ClawHost 官方持有，用户不接触
- ✅ 统一媒体生成 API，支持未来扩展视频/多 provider

### 2.2 统一 API 设计

```
POST /api/media/generate

Request:
{
  "type": "image",              // "image" | "video" (Phase 2)
  "provider": "gemini",         // "gemini" | "dalle" | "flux" (未来)
  "prompt": "一只穿宇航服的猫",
  "model": "fast",              // "fast" (Flash) | "quality" (Pro)
  "options": {
    "aspect_ratio": "1:1",
    "style": "photographic"
  }
}

Response:
{
  "id": "gen_xxxxx",
  "type": "image",
  "status": "completed",
  "result": {
    "url": "https://r2.clawhost.com/generated/xxx.png",
    "width": 1024,
    "height": 1024
  },
  "usage": {
    "credits_used": 1,
    "daily_used": 2,
    "daily_limit": 3,
    "credits_remaining": 10
  }
}
```

### 2.3 Gemini 生图模型

| 模型 | ID | 特点 |
|------|-----|------|
| Fast | `gemini-2.0-flash` | 快速，低成本 |
| Quality | `gemini-2.0-pro-image` | 高质量，精细 |
| 最新 | `gemini-2.5-flash` (Nano Banana) | 多图融合、角色一致性 |

调用方式：标准 `generateContent` API，设置 `responseModalities: ["TEXT", "IMAGE"]`，返回 `inline_data` 包含 base64 图片。

---

## 3. 计费模型

### 3.1 每日免费额度

| 用户类型 | 每日免费生图 |
|---------|------------|
| Free | 0 张 |
| Pro | 3 张/天 |
| Enterprise | 10 张/天 |

### 3.2 Credits 系统（MVP）

- 每日限额用完后，从 credits 余额扣
- **MVP 阶段不做购买功能**，由管理员后台直接发放 credits（前期体验用户）
- 后续接 Stripe 购买

### 3.3 扣费流程

```
用户发起生图 →
  检查今日已用次数 (media_usage 表) →
    已用 < 每日限额 → 免费，调 Gemini →
    已用 >= 限额 → 检查 credits →
      有 credits → 扣 1 credit，调 Gemini →
      无 credits → 返回 "今日额度已用完"
```

### 3.4 成本估算

| 项 | 成本 |
|-----|------|
| Gemini Flash 生图 | ~$0.01-0.02/张 |
| 卖价（1 credit） | $0.05-0.10/张 |
| **毛利** | **70-80%** |

---

## 4. 数据库设计

### media_usage 表

```sql
CREATE TABLE media_usage (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,            -- 'image' | 'video'
  provider TEXT NOT NULL,        -- 'gemini' | 'dalle'
  model TEXT,
  prompt TEXT,
  result_url TEXT,
  credits_used INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT false, -- 是否走每日免费额度
  created_at TIMESTAMP DEFAULT NOW()
);
```

### user_credits 表

```sql
CREATE TABLE user_credits (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  balance INTEGER DEFAULT 0,     -- 当前余额
  total_granted INTEGER DEFAULT 0,
  total_used INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 5. 后端模块结构

```
apps/api/src/
├── routes/media.ts                    # POST /api/media/generate
├── controllers/media/
│   ├── generateMedia.ts               # 统一入口：鉴权 → 限额 → 分发
│   ├── providers/
│   │   ├── geminiImage.ts             # Gemini 生图实现
│   │   └── geminiVideo.ts             # (Phase 2)
│   └── helpers/
│       ├── checkQuota.ts              # 每日限额 + credits 检查
│       └── recordUsage.ts             # 记录用量
├── db/schema.ts                       # 新增: media_usage, user_credits
```

---

## 6. 前端改动

### 6.1 对话框（AgentChat）

- `ChatBubble` 已支持图片渲染（base64/url + lightbox）
- 新增：生图进度状态显示（"生成中..."）
- 新增：每日额度/credits 余额提示

### 6.2 Dashboard

- 用量统计页面（可选，Phase 2）
- Credits 管理入口（Phase 2）

---

## 7. 任务拆分

### Phase 1：生图 MVP

| # | 任务 | 角色 | 预估 |
|---|------|------|------|
| 1 | DB migration：`media_usage` + `user_credits` 表 | Backend | 0.5d |
| 2 | `POST /api/media/generate` API（鉴权+限额+Gemini调用） | Backend | 1-2d |
| 3 | Agent Tool：`generate_image` 调 ClawHost API | Backend | 0.5d |
| 4 | 前端对话框生图展示 + 进度 | Frontend | 1d |
| 5 | 前端 credits/额度显示 | Frontend | 0.5d |
| | **合计** | | **3.5-4.5d** |

### Phase 2：生视频 + Credits 购买

| # | 任务 | 说明 |
|---|------|------|
| 1 | 生视频方案（Gemini Veo / Pexels+ffmpeg） | 从旧版迁移 |
| 2 | `type: "video"` 支持 | 异步任务 + 进度轮询 |
| 3 | Credits 购买（Stripe） | 接现有 Stripe 体系 |
| 4 | 用量统计 Dashboard | 图表展示 |

---

## 8. 关键决策记录

| 日期 | 决策 | 决策者 |
|------|------|--------|
| 2026-03-31 | 不用 MJ Proxy，改用 Gemini 官方 API | Jayce |
| 2026-03-31 | 直连 Gemini API，不走 Spear Proxy | Jayce |
| 2026-03-31 | 统一媒体生成 API（image + video 共用） | Jayce + Lisa |
| 2026-03-31 | 每日 3 张免费额度（Pro），MVP 不做 credits 购买 | Jayce |
| 2026-03-31 | 分支策略：从 develop 切分支，PR 到 develop | Jayce |
