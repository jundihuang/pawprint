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
  → 鉴权 + Credits 检查 + 扣费
  → 直连 Gemini API (我们的 Key)
  → 返回图片 → 对话框展示
```

**关键决策：**
- ✅ 直连 Gemini API（不走 Spear Proxy），减少依赖
- ✅ API Key 由 ClawHost 官方持有，用户不接触
- ✅ 统一媒体生成 API，支持未来扩展视频/多 provider
- ✅ 统一 Credits 系统，跨服务通用（生图、生视频、TTS 等共用一个 credits 池）

### 2.2 统一 API 设计

```
POST /api/media/generate

Request:
{
  "type": "image",              // "image" | "video" (Phase 2)
  "provider": "gemini",         // "gemini" | "dalle" | "flux" (未来)
  "prompt": "一只穿宇航服的猫",
  "model": "fast",              // "fast" (Flash) | "quality" (Pro) | "premium"
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

| 模型 | ID | 扣除 Credits | 特点 |
|------|-----|-------------|------|
| Fast | `gemini-2.0-flash` | 1 credit | 快速，低成本 |
| Quality | `gemini-2.0-pro-image` | 3 credits | 高质量，精细 |
| Premium | `gemini-2.5-flash` (Nano Banana) | 5 credits | 多图融合、角色一致性 |

调用方式：标准 `generateContent` API，设置 `responseModalities: ["TEXT", "IMAGE"]`，返回 `inline_data` 包含 base64 图片。

---

## 3. 计费模型

### 3.1 统一 Credits 系统

采用 **统一 Credits 池** 设计，一套 credits 覆盖所有付费服务：

- 🎨 生图（image_gen）
- 🎬 生视频（video_gen）— Phase 2
- 🗣️ TTS（tts）— 未来
- 🌐 翻译（translation）— 未来
- ... 新增服务只需定义 `service` 名和 credits 消耗量

**用户只需理解一个概念："我有多少 credits"**，充一次到处用。

### 3.2 每日免费 Credits 额度

所有 ClawHost 用户都是付费用户（已购 VPS + OpenClaw），因此所有层级都有免费额度：

| 用户类型 | 每日免费 Credits | 可生图量（示例） |
|---------|----------------|----------------|
| Free (已购 VPS) | 3 credits/天 | 3 张 Fast 或 1 张 Quality |
| Pro | 5 credits/天 | 5 张 Fast 或 1 张 Quality + 2 张 Fast |
| Enterprise | 15 credits/天 | 15 张 Fast 或 3 张 Premium |

### 3.3 各服务 Credits 定价

| 服务 | 动作 | Credits 消耗 |
|------|------|-------------|
| image_gen | generate (fast) | 1 credit |
| image_gen | generate (quality) | 3 credits |
| image_gen | generate (premium) | 5 credits |
| video_gen | generate (short) | 10 credits |
| video_gen | generate (medium) | 20 credits |
| tts | synthesize | 1 credit |

### 3.4 扣费流程

```
用户发起服务请求（如生图，选择模型） →
  计算所需 credits (cost) →
  查今日已用 credits (credit_transactions 表 SUM) →
    今日已用 + cost <= 每日限额 → 免费，执行服务 →
    今日已用 + cost > 每日限额 → 检查 credits 余额 →
      余额 >= cost → 扣 credits，执行服务 →
      余额 < cost → 返回 "额度不足"
```

### 3.5 MVP 阶段

- ✅ 每日免费额度
- ✅ Credits 余额扣费
- ✅ 管理员后台发放 credits（前期体验用户）
- ✅ 用量记录
- ❌ 不做 credits 购买（后续接 Stripe）

### 3.6 成本估算（生图）

| 模型 | 我们成本 | 扣除 Credits | 定价 (1 credit ≈ $0.05) |
|------|---------|-------------|------------------------|
| Fast | ~$0.005/张 | 1 credit ($0.05) | 毛利 90% |
| Quality | ~$0.02/张 | 3 credits ($0.15) | 毛利 87% |
| Premium | ~$0.03/张 | 5 credits ($0.25) | 毛利 88% |

---

## 4. 数据库设计

### 4.1 credit_transactions 表（统一账本）

所有 credits 增减操作记录在一张表中，完整审计链：

```sql
CREATE TABLE credit_transactions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,            -- 'daily_grant' | 'admin_grant' | 'purchase' | 'consumption' | 'refund' | 'expiry'
  amount INTEGER NOT NULL,       -- 正数=增加，负数=扣除
  balance_after INTEGER NOT NULL, -- 操作后余额（方便快速查）
  
  -- 通用服务字段（消费时填写）
  service TEXT,                  -- 'image_gen' | 'video_gen' | 'tts' | 'stt' | 'translation' | ...
  action TEXT,                   -- 'generate' | 'upscale' | 'edit' | 'synthesize' | ...
  
  -- 服务详情（JSON，灵活扩展不同服务的特有字段）
  metadata JSONB,                -- { provider, model, prompt, result_url, aspect_ratio, ... }
  
  -- 充值来源（充值时填写）
  source TEXT,                   -- 'stripe' | 'admin' | 'system' | 'referral'
  reference_id TEXT,             -- Stripe payment_id / admin 备注
  
  note TEXT,                     -- 可选备注
  created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_credit_tx_user ON credit_transactions(user_id);
CREATE INDEX idx_credit_tx_user_date ON credit_transactions(user_id, created_at);
CREATE INDEX idx_credit_tx_service ON credit_transactions(service, created_at);
```

### 4.2 user_credit_balances 表（快速查余额）

冗余但高效，避免每次 SUM：

```sql
CREATE TABLE user_credit_balances (
  user_id TEXT PRIMARY KEY,
  balance INTEGER DEFAULT 0,       -- 当前购买/发放的 credits 余额
  daily_used INTEGER DEFAULT 0,    -- 今日已用（所有服务合计）
  daily_limit INTEGER DEFAULT 3,   -- 每日免费额度（按用户等级设）
  daily_reset_at DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.3 账本记录示例

```
| type          | amount | balance_after | service    | action   | metadata                              |
|---------------|--------|---------------|------------|----------|---------------------------------------|
| daily_grant   | +5     | 5             | -          | -        | -                                     |
| consumption   | -1     | 4             | image_gen  | generate | { model: "fast", prompt: "..." }      |
| consumption   | -3     | 1             | image_gen  | generate | { model: "quality", prompt: "..." }   |
| admin_grant   | +50    | 51            | -          | -        | { reason: "beta tester" }             |
| purchase      | +100   | 151           | -          | -        | { stripe_id: "pi_xxx" }              |
| consumption   | -5     | 146           | image_gen  | generate | { model: "premium", prompt: "..." }   |
| refund        | +5     | 151           | image_gen  | generate | { reason: "generation failed" }       |
| consumption   | -10    | 141           | video_gen  | generate | { model: "short", duration: 30 }      |
| consumption   | -1     | 140           | tts        | synthesize| { voice: "alloy", chars: 500 }       |
```

### 4.4 设计优势

1. **完整审计链** — 每一笔增减都有迹可查
2. **跨服务通用** — 新增服务只需定义 `service` + `action` + credits 消耗量，无需改表
3. **灵活 metadata** — JSONB 字段适应不同服务的特有数据，不污染主表结构
4. **对账简单** — `SUM(amount) WHERE user_id = x` = 当前余额（与 balance_after 交叉验证）
5. **`balance_after`** — 冗余字段，无需每次 SUM，直接读最新一条

---

## 5. 后端模块结构

```
apps/api/src/
├── routes/media.ts                    # POST /api/media/generate
├── controllers/media/
│   ├── generateMedia.ts               # 统一入口：鉴权 → Credits 检查 → 分发
│   ├── providers/
│   │   ├── geminiImage.ts             # Gemini 生图实现
│   │   └── geminiVideo.ts             # (Phase 2)
│   └── helpers/
│       ├── checkCredits.ts            # 每日限额 + credits 余额检查
│       └── recordTransaction.ts       # 写入 credit_transactions
├── controllers/credits/
│   ├── getBalance.ts                  # 查询用户 credits 余额
│   ├── grantCredits.ts               # 管理员发放 credits
│   └── getUsageHistory.ts            # 用量历史
├── routes/credits.ts                  # GET /api/credits, POST /api/credits/grant
├── db/schema.ts                       # 新增: credit_transactions, user_credit_balances
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
| 1 | DB migration：`credit_transactions` + `user_credit_balances` 表 | Backend | 0.5d |
| 2 | Credits 扣费逻辑（checkCredits + recordTransaction） | Backend | 1d |
| 3 | `POST /api/media/generate` API（鉴权+扣费+Gemini调用） | Backend | 1-2d |
| 4 | Credits 管理 API（查余额 + 管理员发放） | Backend | 0.5d |
| 5 | Agent Tool：`generate_image` 调 ClawHost API | Backend | 0.5d |
| 6 | 前端对话框生图展示 + 进度 | Frontend | 1d |
| 7 | 前端 credits/额度显示 | Frontend | 0.5d |
| | **合计** | | **5-6d** |

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
| 2026-03-31 | 统一 Credits 池（账本模式），跨服务通用，按模型差异化扣费 | Jayce |
| 2026-03-31 | 所有用户都有每日免费额度（Free=3/Pro=5/Enterprise=15 credits） | Jayce |
| 2026-03-31 | MVP 不做 credits 购买，管理员后台直接发放 | Jayce |
| 2026-03-31 | 分支策略：从 develop 切分支，PR 到 develop | Jayce |
