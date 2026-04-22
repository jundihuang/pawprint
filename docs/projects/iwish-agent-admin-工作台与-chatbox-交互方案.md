# iwish Agent Admin 工作台与 Chatbox 交互方案

## 1. 文档定位

本文档用于说明 iwish Agent 系统在 `iwish-admin` 中应该如何交互。

重点回答：

- Agent 工作台应该是什么
- Chatbox 是否需要存在
- Chatbox 和具体业务 Agent 是什么关系
- 用户提出新颖任务想法时，系统如何承接
- Agent 如何做到有应变能力，但又不失控
- Review Queue、Artifacts、AgentRun 在 Admin 中如何协作

本文档与 `iwish-agent-技术路线与系统边界方案.md` 对齐：

```text
iwish-server
  -> IwishAgent Rails Engine
  -> Agent Runtime
  -> Business Agents

iwish-admin
  -> Agent Center
  -> Agent 工作台
  -> Chatbox
  -> Review Queue
  -> Artifacts
```

## 2. 核心结论

iwish-admin 中的 Agent 交互不应该只做成聊天机器人。

更推荐的结构是：

```text
Agent 工作台 = 结构化任务入口
Chatbox = 自然语言控制层
业务 Agent = 有边界的自适应执行单元
Review Queue = 人工中断与审批队列
Artifacts = Agent 产物中心
```

一句话：

```text
工作台承接标准流程，Chatbox 承接自然语言意图，业务 Agent 负责真正执行。
```

## 3. Agent Center 信息架构

建议在 `iwish-admin` 中增加 `Agent Center` 模块。

初期包含：

- Agent 工作台
- Agent 执行记录
- Agent Run 详情
- Review Queue
- Artifacts 产物中心
- Chatbox

后期再考虑：

- Agent 配置
- Model Policy
- Tool Registry
- Workflow Templates
- 成本统计
- 多 Agent 协作视图

MVP 不建议一开始做：

- 可视化拖拽 Workflow
- 复杂 Agent 编排画布
- 完整 Agent 市场
- 独立 Agent Admin

## 4. Agent 工作台

Agent 工作台是标准任务入口。

用户进入后看到可执行的业务 Agent 卡片：

- 报告 Agent
- 素材 Agent
- 投放诊断 Agent
- 数据异常 Agent

每张 Agent 卡片展示：

- Agent 用途
- 需要的数据源
- 可输出的产物
- 预计耗时
- 是否可能需要人工审批
- 最近执行记录
- 开始任务按钮

示例：

```text
报告 Agent

用途：
生成项目运营复盘、投流分析、素材专题报告。

需要：
项目、时间范围、广告数据、Shopify 数据、GA4 数据。

预计耗时：
3-8 分钟。

可能需要审批：
缺失数据估算、报告发布确认、关键结论确认。
```

## 5. 创建 Agent 任务

用户点击某个 Agent 后，进入结构化任务表单。

以报告 Agent 为例：

- 选择项目
- 选择时间范围
- 选择报告类型
- 选择数据源
- 选择输出格式
- 是否允许估算缺失数据
- 是否需要发布前人工确认
- 可填写自定义报告 Brief

提交后创建：

```text
AgentRun
```

并进入 Agent Run 详情页。

后端调用：

```text
POST /agent/agent_runs
```

## 6. Agent Run 详情页

Agent Run 详情页是执行过程的主视图。

它展示：

- 当前状态
- 执行进度
- Step 列表
- 实时日志
- 使用的数据源
- 模型调用记录
- 工具调用记录
- 中间产物
- 最终产物
- 待处理审批
- 错误与重试记录

状态建议：

```text
draft
queued
running
waiting_for_review
failed
completed
cancelled
```

示例：

```text
报告 Agent / OdinLake 2026 Q1 复盘

状态：running
进度：4 / 7 steps

Steps:
1. 创建输入快照 completed
2. 读取广告数据 completed
3. 读取 Shopify 数据 completed
4. 分析异常 running
5. 生成报告 pending
6. 等待人工确认 pending
7. 导出报告 pending
```

Agent Run 详情页应该支持上下文 Chatbox。

用户可以问：

```text
第 4 步为什么这么久？
这个异常结论是怎么来的？
帮我把报告摘要改成更适合客户汇报的语气。
```

## 7. Review Queue

Review Queue 用于承接 Agent 执行中的人工中断。

它不是聊天窗口，而是结构化审批系统。

典型场景：

- 缺失数据是否允许估算
- 是否采用某批素材作为训练样本
- 是否发布最终报告
- 是否继续访问外部系统
- 是否允许执行敏感操作

示例：

```text
报告 Agent 发现 GA4 数据缺失 2 天。

Agent 建议：
使用前后 7 日均值估算。

请选择：
[允许估算] [跳过该指标] [停止任务]
```

审批后调用：

```text
POST /agent/review_requests/:id/resolve
```

然后 Agent 继续执行。

## 8. Artifacts 产物中心

Artifacts 是 Agent 生成的中间产物和最终产物。

包括：

- 报告草稿
- 最终报告
- 素材标签
- 素材分析 JSON
- 图片理解结果
- 数据快照
- 外部系统导出文件
- 训练素材候选清单

用户可以：

- 预览
- 下载
- 标记为采用
- 标记为不采用
- 复制到报告
- 作为后续 Agent 输入

Artifacts 必须可追溯到：

- 哪个 AgentRun 生成
- 哪个 Step 生成
- 使用了哪些数据源
- 使用了哪些模型
- 是否经过人工审批

## 9. Chatbox 的定位

Chatbox 可以存在，而且很有价值。

但它不应该替代 Agent 工作台。

更准确的定位是：

```text
Chatbox = 自然语言控制层
Agent 工作台 = 结构化任务系统
Business Agent = 执行层
```

Chatbox 负责：

- 理解用户意图
- 匹配合适的 Agent
- 补齐任务参数
- 生成 Task Draft
- 让用户确认
- 创建 AgentRun
- 查询执行状态
- 解释执行结果
- 基于当前页面上下文回答问题

Chatbox 不应该直接：

- 修改预算
- 发布报告
- 删除素材
- 纳入训练集
- 跳过审批
- 绕过权限访问外部账户

敏感动作必须进入结构化确认或 Review Queue。

## 10. 全局 Chatbox

全局 Chatbox 可以放在 Admin 右下角或顶部。

它负责跨页面的自然语言入口。

用户可以说：

```text
帮我生成 OdinLake 9 月运营复盘报告。
```

Chatbox 不应该立即黑盒执行，而是生成 Task Draft：

```json
{
  "agent": "report_agent",
  "task_type": "monthly_review",
  "project": "OdinLake",
  "date_range": "2026-09-01..2026-09-30",
  "data_sources": ["Meta Ads", "Google Ads", "Shopify", "GA4"],
  "outputs": ["html_report", "pdf_report"],
  "requires_review": true
}
```

然后展示：

```text
我将创建一个报告 Agent 任务：

项目：OdinLake
时间：2026-09
类型：月度运营复盘
数据源：Meta Ads / Google Ads / Shopify / GA4
输出：HTML + PDF
需要发布前确认

[确认创建] [修改参数]
```

用户确认后才创建 AgentRun。

## 11. 上下文 Chatbox

上下文 Chatbox 出现在具体页面内。

例如：

- Agent Run 详情页
- 报告预览页
- 素材分析页
- Review Request 详情页
- Artifact 预览页

它读取当前上下文：

- agent_run_id
- step_id
- artifact_id
- logs
- review_request_id

用户可以问：

```text
为什么这张图被判断为活动素材？
这份报告有哪些风险？
帮我把这一段改成更适合客户看的表达。
第 5 步失败原因是什么？
```

上下文 Chatbox 不需要重新选择 Agent，而是围绕当前对象解释、追问、生成修订动作。

## 12. Chatbox 与业务 Agent 的关系

Chatbox 不是具体业务 Agent。

它更像：

```text
Agent Router
Agent Assistant
自然语言任务入口
```

流程是：

```text
用户自然语言
  -> Chatbox 理解意图
  -> 匹配 Agent
  -> 补齐参数
  -> 生成 Task Draft
  -> 用户确认
  -> 创建 AgentRun
  -> 具体业务 Agent 执行
```

具体执行仍然由业务 Agent 完成：

- 报告 Agent
- 素材 Agent
- 投放诊断 Agent
- 数据异常 Agent

## 13. Task Draft

Task Draft 是 Chatbox 和 AgentRun 之间的缓冲层。

它的作用是：

- 把自然语言变成结构化输入
- 暴露系统理解结果
- 让用户确认或修改
- 避免 Chatbox 黑盒执行
- 为 AgentRun 提供标准输入

Task Draft 示例：

```json
{
  "agent": "material_agent",
  "task_type": "asset_performance_analysis",
  "project": "OdinLake",
  "date_range": "2026-09-01..2026-09-30",
  "outputs": [
    "asset_tags",
    "training_candidates",
    "summary_report"
  ],
  "requires_review": true,
  "constraints": {
    "do_not_auto_add_to_training_set": true
  }
}
```

Task Draft 可以有状态：

```text
draft
missing_info
ready_to_confirm
confirmed
cancelled
converted_to_agent_run
```

## 14. 业务 Agent 的应变能力

业务 Agent 不应该是死板模板。

它应该是：

```text
稳定能力边界内的自适应工作流
```

它有稳定骨架：

- 读取数据
- 校验数据
- 分析问题
- 检索知识库
- 调用工具
- 生成产物
- 触发审批
- 保存结果

但每次任务可以动态变化：

- 任务目标
- 报告视角
- 受众
- 语气
- 重点问题
- 输出结构
- 允许或禁止的数据源
- 是否需要审批
- 是否允许估算

所以业务 Agent 不是：

```text
固定模板
```

也不是：

```text
完全自由发挥的聊天机器人
```

而是介于两者之间。

## 15. 新颖报告方案如何承接

如果用户在 Chatbox 中提出一个新颖报告方案，例如：

```text
这次不要做传统运营复盘。
我想做一份创始人视角报告，重点讲增长瓶颈、投放失误、下一季度机会。
不要太多常规表格。
```

Chatbox 应该把它转成 `report_brief`：

```json
{
  "agent": "report_agent",
  "report_type": "custom",
  "report_brief": {
    "theme": "创始人视角增长复盘",
    "tone": "直接、战略化、少废话",
    "focus": [
      "增长瓶颈",
      "投放失误",
      "下一季度机会",
      "关键决策建议"
    ],
    "avoid": [
      "过多常规表格",
      "流水账式数据复述"
    ],
    "output_structure": [
      "一句话结论",
      "3 个核心问题",
      "关键证据",
      "下一季度建议"
    ]
  }
}
```

报告 Agent 仍然执行稳定骨架：

```text
收集数据
清洗数据
识别异常
整理证据
生成报告
质量检查
保存产物
```

但生成阶段会使用 `report_brief` 调整报告视角、结构和语气。

## 16. 能力边界判断

Chatbox 需要判断用户的新想法是否在当前 Agent 能力范围内。

如果只是改变：

- 报告视角
- 报告结构
- 叙事方式
- 分析重点
- 输出格式
- 语气风格

则可以直接转成 Brief 并创建 AgentRun。

如果用户要求：

- 接入新数据源
- 访问未授权平台
- 调用未注册工具
- 生成视频报告
- 自动修改广告预算
- 跳过审批

则不能直接执行。

Chatbox 应该提示：

```text
这个方案需要新增 TikTok Ads 数据源工具。
我可以先创建一个不包含 TikTok Ads 的报告任务，或创建一个能力需求。

[继续创建降级版任务] [创建能力需求] [取消]
```

## 17. Chatbox + Structured Actions

Chatbox 不应该只是文本回复。

它应该返回结构化动作。

例如：

- 创建报告任务
- 创建素材分析任务
- 打开审批项
- 查看产物
- 重新运行失败步骤
- 生成报告修订版
- 创建能力需求

示例：

```text
我发现这个任务缺少 GA4 数据授权。

你可以：
[去授权 GA4] [跳过 GA4 数据继续] [取消任务]
```

这样 Chatbox 可以保持自然语言体验，同时不会绕过系统流程。

## 18. MVP 建议

MVP 建议先做：

- Agent 工作台
- AgentRun 创建表单
- AgentRun 列表
- AgentRun 详情
- Review Queue
- Artifacts 预览
- 全局 Chatbox 的 Task Draft 能力
- AgentRun 详情页上下文 Chatbox 的解释能力

MVP 暂不做：

- Chatbox 直接执行敏感动作
- 可视化 Workflow 编排
- 多 Agent 自动协作
- 成本大屏
- 模型策略可视化配置
- 完整能力需求管理系统

## 19. 最终判断

iwish-admin 中的 Agent 交互应该采用：

```text
Agent 工作台 + Chatbox + Review Queue + Artifacts
```

其中：

```text
Agent 工作台负责标准化任务入口
Chatbox 负责自然语言理解和任务草稿
业务 Agent 负责有边界的自适应执行
Review Queue 负责人工中断和审批
Artifacts 负责产物沉淀与复用
```

一句话总结：

```text
Chatbox 不是某个具体 Agent；
它是 Agent 系统的自然语言控制层。

业务 Agent 也不是死模板；
它是稳定能力边界内的自适应工作流。
```
