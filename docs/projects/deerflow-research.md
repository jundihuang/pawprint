# DeerFlow 调研报告：字节跳动开源 SuperAgent 框架

> 调研日期：2026-03-26
> 调研人：Lisa (PM Agent)

---

## 一、DeerFlow 是什么

**DeerFlow**（Deep Exploration and Efficient Research Flow）是字节跳动开源的超级智能体（SuperAgent）框架。

- **GitHub**: [github.com/bytedance/deer-flow](https://github.com/bytedance/deer-flow) — MIT 协议
- **官网**: [deerflow.tech](https://deerflow.tech)
- **Stars**: 22,200+（2026.2.28 v2.0 发布后 GitHub Trending #1）
- **推荐模型**: 豆包 Seed-2.0-Code / DeepSeek v3.2 / Kimi 2.5

---

## 二、版本演进

- **v1**（2025.5）→ Deep Research 助手，基于 LangChain + LangGraph，搜索→分析→生成报告/播客
- **v2**（2026.2）→ 完全重写，升级为"全栈超级智能体执行底座"

> 一句话区别：v1 是"帮你查资料写报告"，v2 是"给 AI 一台电脑让它自己干完整项目"

---

## 三、核心架构（v2）

```
用户指令 → 主代理（Lead Agent）拆解任务
  → 子代理A(搜索) + 子代理B(分析) + 子代理C(生成) [并行]
  → 结果汇总 → 最终输出
```

### 关键能力

#### 1) 子代理并行调度
- 自动拆解复杂任务，上下文隔离
- 效率提升 3-5x

#### 2) Docker 沙箱
- 每个任务独立容器，完整文件系统
- `/mnt/user-data/uploads/` | `workspace/` | `outputs/`
- 真正能执行代码，不只是生成文本

#### 3) Markdown Skills 系统
- 技能以 `.md` 文件定义
- 公共技能 `/mnt/skills/public/`（研究、报告、PPT、前端设计、视频生成）
- 自定义技能 `/mnt/skills/custom/`
- 按需加载，不占上下文窗口

#### 4) 长短期记忆
- 长期：用户偏好、历史项目设置
- 短期：已完成子任务自动总结并卸载到文件系统

#### 5) MCP Server 扩展
- HTTP/SSE MCP，支持 OAuth token 流

#### 6) IM 渠道集成
- Telegram（Bot API 长轮询）/ Slack（Socket Mode）/ 飞书（WebSocket）
- 无需公网 IP

#### 7) Claude Code / Codex CLI 集成
- 可直接用 Claude Code 和 OpenAI Codex 作为后端 coding 模型

#### 8) 系统架构
- nginx（2026 端口）→ LangGraph Server（核心运行时）→ Gateway API（FastAPI）
- 部署：Docker 推荐，也支持本地开发

---

## 四、与 OpenClaw 架构对比

| 维度 | DeerFlow 2.0 | OpenClaw |
|------|-------------|----------|
| **定位** | 超级智能体执行框架（研究/编码/创作） | 个人 AI 助手平台（全渠道通讯+自动化） |
| **核心场景** | 深度研究、代码生成、内容创作 | 日常助手、团队协作、多渠道消息 |
| **Agent 架构** | Lead Agent → 子代理并行（LangGraph） | 单 Gateway 多 Agent 路由（Binding 机制） |
| **多 Agent** | 主代理自动拆解→子代理执行 | 多个隔离 Agent（独立 workspace/session/auth） |
| **子代理** | 自动并行调度，上下文隔离 | sessions_spawn 手动/自动派生子代理 |
| **技能系统** | Markdown Skills（.md 文件，按需加载） | Skills（SKILL.md + 脚本/引用，按描述自动匹配） |
| **代码执行** | Docker 沙箱（独立容器+持久化文件系统） | exec 工具 + 可选 Docker 沙箱（per-agent scope） |
| **记忆** | 长短期记忆 + 上下文压缩 | MEMORY.md + memory/*.md + session 历史 |
| **消息渠道** | Telegram / Slack / 飞书 | WhatsApp / Telegram / Discord / Slack / Signal / iMessage / 飞书等 15+ |
| **模型支持** | 任何 OpenAI 兼容 API + Claude Code + Codex CLI | 35+ 提供商（Anthropic / OpenAI / Google / 自托管） |
| **部署方式** | Docker / 本地（需 Python 3.12+ / Node 22+） | npm 全局安装 / Docker / VPS 一键部署 |
| **协议** | MIT | 专有 |
| **Node/移动端** | 无 | iOS / Android / macOS 节点（相机/屏幕/位置） |
| **浏览器自动化** | 无（通过沙箱间接实现） | 内置 browser 工具 |
| **Cron/定时** | 无内置 | 内置 cron + heartbeat |
| **UI** | Web UI（localhost:2026） | WebChat + macOS 菜单栏 + Control UI |

### 核心差异总结

🦌 **DeerFlow** 是一个**任务执行引擎**——你给它一个复杂任务，它自动拆解、并行执行、在沙箱里跑代码，最后输出完整产物（报告/网站/视频）。强在**深度任务**的自动化编排。

🦞 **OpenClaw** 是一个**全渠道 AI 助手平台**——重点在消息路由、多渠道接入、多 Agent 隔离管理、移动端节点、日常自动化。强在**持续在线**的个人/团队助手体验。

> 互补关系：DeerFlow 适合当"重型任务工人"，OpenClaw 适合当"7x24 在线管家"。理论上 OpenClaw 可以调用 DeerFlow 来执行深度研究任务。

---

## 五、与 ClawHost 对比

**ClawHost** 是 OpenClaw 的**托管服务平台**（非框架），定位完全不同：

| 维度 | DeerFlow 2.0 | ClawHost |
|------|-------------|----------|
| **是什么** | AI Agent 执行框架 | OpenClaw 托管服务（Hosting） |
| **定位** | 开发者自建 SuperAgent | 非技术用户一键部署 OpenClaw |
| **核心功能** | 子代理编排/沙箱/Skills | VPS 自动配置/DNS/SSL/监控 |
| **技术栈** | Python + LangGraph + Docker | TypeScript + Hono + React + Turborepo |
| **云提供商** | 自托管 | Hetzner / DigitalOcean / Vultr |
| **开源** | MIT | MIT（github.com/bfzli/clawhost） |
| **用户** | 开发者/研究者 | 想用 OpenClaw 但不想管服务器的人 |
| **渠道** | Telegram/Slack/飞书 | 继承 OpenClaw 全部渠道 |
| **计费** | 免费（自托管+自付模型费） | 订阅制（Polar.sh 集成） |

> 本质区别：DeerFlow 是"引擎"，ClawHost 是"4S 店"——一个让你造车，一个帮你买车上牌。

---

## 六、值得关注的点

🟢 字节出品，中文生态友好，对国内开发者支持完善
🟢 真正的代码执行能力（不是只生成文本），Docker 隔离企业级安全
🟢 Skills 系统设计优雅——Markdown 定义技能，版本控制友好
🟢 IM 渠道原生集成（飞书！），适合团队内部署

🟡 部署需要 Docker 环境，对非技术用户有门槛
🟡 沙箱镜像较大，服务器配置要求不低
🟡 社区生态相比 LangChain 还在早期

---

## 七、竞品对比

| 维度 | DeerFlow 2.0 | OpenAI Deep Research | AutoGPT |
|------|-------------|---------------------|---------|
| 开源 | MIT ✅ | 闭源 ❌ | MIT ✅ |
| 成本 | 免费 | $20/月 | 免费 |
| 代码执行 | Docker 沙箱 | 仅报告 | 有限 |
| 文件持久化 | 完整支持 | 无 | 基础 |
| 自定义技能 | Markdown 系统 | 固定 | 插件 |
| 上手难度 | 中等 | 低 | 高 |
