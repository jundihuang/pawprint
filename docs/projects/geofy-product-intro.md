# Geofy — 让你的 Shopify 店铺被 AI 搜索引擎看见

> AI 时代的 SEO 不只是关键词，而是让 ChatGPT、Google SGE、Perplexity 真正「理解」你的产品。

---

## 一句话介绍

**Geofy** 是一款 Shopify 插件，通过 AI 驱动的结构化数据优化、LLMs.txt 生成和全站 Schema 标记注入，帮助商家提升产品在 AI 搜索引擎中的可见性和推荐率。

---

## 🤖 为什么需要 Geofy？

传统 SEO 优化的是 Google 爬虫；但今天，越来越多的消费者通过 **AI 搜索** 发现产品：

- **ChatGPT Search** — "推荐一款适合跑步的轻量运动鞋"
- **Google SGE** — AI 生成式搜索结果
- **Perplexity AI** — AI 驱动的问答搜索
- **Bing Chat** — 微软 AI 搜索

这些 AI 引擎不只是看关键词和链接——它们需要 **结构化的、语义清晰的产品数据** 才能准确理解并推荐你的产品。

**问题是**：大部分 Shopify 店铺的产品数据是给人看的，不是给 AI 看的。标题模糊、描述缺乏语义属性、没有结构化标记……AI 搜索引擎根本无法高效理解你的产品。

**Geofy 解决的就是这个问题。**

---

## 🎯 三大核心模块

### 模块一：Catalog Optimization — AI 产品目录优化

#### 📊 GEO Score 评分系统

Geofy 为每个产品计算 **GEO Score（0-100 分）**，量化该产品在 AI 搜索引擎中的表现。

评分维度：

| 维度 | 权重 | 说明 |
|------|------|------|
| 结构化数据质量 | 42% | Schema.org 标准属性完整度、嵌套结构规范性（含 Offer/Brand/Seller 检测） |
| AI 可理解性 | 30% | 产品描述的语义丰富度、产品专用关键词覆盖 |
| 多模态内容 | 20% | 图片数量和质量 |
| 信任信号 | 8% | 品牌、SKU、GTIN、MPN 等产品标识 |

还有一个轻量级的 **Readiness Score**（数据完整性体检），不消耗 AI 配额，可批量扫描全店产品。

#### 🧠 AI 智能分析

对于需要优化的产品，AI 自动执行：

1. **类型识别** — 基于 Shopify Standard Product Taxonomy，智能判断产品的 Schema.org 类型
2. **属性提取** — 从描述中提取 16 种标准属性（材质、颜色、尺码、品牌、SKU、GTIN、产地等）
3. **深度分类** — 多层级产品分类推荐（DeepCategorizer），精确到叶子节点
4. **优化建议** — 告诉你具体怎么改，改完能提升多少分

#### ⚡ 一键应用

选中你认可的建议，支持按条选择，点击 Apply：

- 自动更新 Shopify 产品字段（标题、描述、类型等）
- 自动写入 Metafields（材质、颜色等扩展属性）
- 自动生成 JSON-LD 结构化数据并存入 Shopify Metafield
- 支持 Dry Run 预览模式，改之前先看效果
- 所有操作原子性执行——先写 Shopify，成功后再同步本地

#### 🏗️ JSON-LD 自动生成

根据优化后的属性，自动生成符合 [Schema.org](https://schema.org/) 的 JSON-LD 结构化数据，包含：

- Product 基础信息（名称、描述、图片）
- Brand（嵌套 Brand 对象）
- Offer（价格、库存、货币、Seller）
- 16 种扩展属性（material、color、size、pattern、gender、ageGroup、weight、model 等）

JSON-LD 存入 Shopify Metafield（`geoify.json_ld`），由前端 Theme App Extension 自动注入页面 `<head>`。

---

### 模块二：LLMs.txt — 让 AI 主动认识你的店铺

[LLMs.txt](https://llmstxt.org/) 是一个新兴标准，类似 robots.txt，但专门面向 AI 搜索引擎。

Geofy 自动为你的店铺生成 LLMs.txt 文件，通过 `yourstore.com/llms.txt`（自动创建 URL Redirect）即可访问。

#### 包含内容

- 🏪 **店铺简介** — 名称、描述、货币、产品数量
- 🛍️ **产品目录** — Best-Selling（按价格排序 Top 8）+ 全部产品
- 📂 **分类结构** — Collections、Pages、Blog 文章完整索引
- 🔗 **Markdown 产品页** — 每个产品都有 AI 友好的纯文本版本（`/apps/geoify/products/{handle}.html.md`）

#### 双模式生成

| 模式 | 说明 | AI 配额 |
|------|------|---------|
| 模板生成 | 基于 Shopify 数据直接生成，快速 | ✅ 不消耗 |
| AI 生成 | AI 优化内容，更具可读性和 SEO 友好度 | ⚠️ 消耗 |

#### URL 管理

内置 URL Manager，商家可以精细控制哪些内容出现在 LLMs.txt 中：
- 支持 include/exclude 状态管理
- 支持标准 URL 和 Markdown URL 两种格式
- 按类型管理（Products、Collections、Pages、Blogs）

---

### 模块三：AI Traffic Booster — 全站结构化标记

通过 Shopify **Theme App Extension**，自动为店铺的每种页面类型注入 Schema.org 结构化数据。

#### 支持的 Schema 类型

| Schema 类型 | 页面 | 说明 |
|-------------|------|------|
| **Product & Reviews** | 产品页 | 产品结构化数据（优先读取 AI 优化的 Metafield，无则自动 fallback） |
| **Organization** | 全站 | 组织/品牌信息、联系方式、社交媒体链接 |
| **Collection** | 分类页 | CollectionPage + ItemList（产品列表） |
| **Blogs** | 博客列表页 | ItemList（文章列表） |
| **Article** | 文章详情页 | Article/NewsArticle/BlogPosting（自动识别类型），含作者、发布者、字数统计 |

#### 工作方式

1. **配置存储**：商家在 Geofy 控制台逐个开关 Schema 类型
2. **双向同步**：配置写入本地数据库的同时，通过 GraphQL 同步到 Shopify Shop Metafield（`app.geo_structured_config`）
3. **前端注入**：Theme App Extension 以 App Embed 形式嵌入 `<head>`，根据 Metafield 配置按页面类型动态注入 JSON-LD
4. **自动清理**：内置 Cleanup 脚本（MutationObserver），自动移除主题自带的冲突 JSON-LD，确保只保留 Geofy 的标准化数据

**零代码集成** — 商家只需在 Shopify 主题设置中启用 Geoify App Embed，然后在 Geofy 控制台开关各 Schema 即可。

---

## 📈 AI 流量监控（Dashboard）

实时追踪 AI 爬虫的访问情况：

- **爬虫分类统计** — ChatGPT、Google SGE、Perplexity 等各引擎的访问次数和占比
- **热门路径** — 哪些产品/页面被 AI 访问最多
- **访问日志** — 完整的爬虫访问明细，支持按类型和日期筛选
- **趋势追踪** — 30 天滚动统计

让你清楚地知道：AI 搜索引擎是否在抓取你的内容，抓了什么，以及优化是否生效。

---

## 💡 商家能获得什么？

### 短期价值

- ✅ **全店体检** — 一键扫描所有产品的 AI 就绪度，找出短板
- ✅ **一键优化** — AI 给建议，你选择应用，自动写入 Shopify
- ✅ **零代码集成** — Schema 标记自动注入，LLMs.txt 自动生成，不需要改主题代码
- ✅ **成本可控** — 内置 AI 配额管理，Readiness Score 和模板生成不消耗配额

### 长期价值

- 🚀 **AI 搜索曝光提升** — 完整的结构化数据让 AI 更容易推荐你的产品
- 📊 **数据驱动优化** — GEO Score 量化效果，持续迭代
- 🔮 **面向未来** — AI 搜索流量占比快速增长，提前布局的商家占据先发优势
- 🏆 **Google Rich Results** — 结构化数据同时提升传统搜索中的富文本展示

---

## 🔧 技术亮点

| 技术 | 说明 |
|------|------|
| Shopify 原生集成 | 标准 Shopify App 架构，Theme App Extension 注入，安装即用 |
| Schema.org 标准 | 遵循国际通用结构化数据标准，覆盖 Product、Organization、Article、CollectionPage |
| Shopify Product Taxonomy | 使用 Shopify 官方产品分类标准进行 AI 深度分类 |
| AI 驱动分析 | 大语言模型进行语义分析、属性提取、建议生成 |
| Metafield 双向同步 | JSON-LD 和配置都同步到 Shopify Metafield，前端直接读取，避免额外 API 请求 |
| 异步批量处理 | Sidekiq 后台任务执行批量分析和体检，不影响店铺性能 |
| Rate Limiting | 内置 AI 调用配额管理（每日限额），合理控制成本 |
| App Proxy | 通过 Shopify App Proxy 无缝提供 LLMs.txt 和 Markdown 内容 |
| URL Redirect | 安装时自动创建 `/llms.txt → /apps/geoify/llms.txt` 跳转 |
| MutationObserver | Theme Extension 自动清理冲突的 JSON-LD 脚本，保证数据唯一性 |

---

## 📋 功能清单

| 功能 | 状态 | 说明 |
|------|------|------|
| **Catalog Optimization** | | |
| 产品 GEO Score 评分 | ✅ 已上线 | 0-100 分，4 维度量化 AI 可见性 |
| Readiness Score 体检 | ✅ 已上线 | 轻量数据完整性评分，不消耗 AI 配额 |
| 店铺批量体检 | ✅ 已上线 | 一键扫描全店产品 |
| AI 深度分析 | ✅ 已上线 | 单品 AI 分析 + 分类推荐 + 属性提取 + 建议生成 |
| 一键应用建议 | ✅ 已上线 | 按条选择，支持 Dry Run 预览，原子性写入 Shopify |
| JSON-LD 自动生成 | ✅ 已上线 | 生成并存入 Shopify Metafield |
| **LLMs.txt** | | |
| LLMs.txt 生成 | ✅ 已上线 | 模板 + AI 双模式 |
| 产品 Markdown 页面 | ✅ 已上线 | AI 友好的纯文本产品内容 |
| URL Manager | ✅ 已上线 | 精细控制 LLMs.txt 包含内容 |
| URL Redirect | ✅ 已上线 | 安装自动创建 `/llms.txt` 跳转 |
| **AI Traffic Booster** | | |
| Product Schema 注入 | ✅ 已上线 | 优先 Metafield → Fallback 自动生成 |
| Organization Schema | ✅ 已上线 | 全站品牌/组织结构化数据 |
| Collection Schema | ✅ 已上线 | 分类页 CollectionPage + ItemList |
| Blog/Article Schema | ✅ 已上线 | 博客列表 + 文章详情（自动识别 Article/News/Blog） |
| JSON-LD Cleanup | ✅ 已上线 | 自动清理主题冲突标记 |
| **监控** | | |
| AI 流量监控 | ✅ 已上线 | 爬虫分类统计 + 热门路径 + 访问日志 |

---

## 🎬 典型使用流程

```
1. 安装 Geofy → 自动同步产品数据 + 创建 URL Redirect
2. 启用 Theme App Embed → Geoify 开始注入结构化数据
3. 开启 AI Traffic Booster → 按需启用各 Schema 类型
4. 运行「店铺体检」→ 获取所有产品的 Readiness Score
5. 查看低分产品 → 点击「AI 分析」获取深度优化建议
6. 选择建议 → 一键 Apply 到 Shopify
7. 启用 LLMs.txt → AI 搜索引擎开始索引
8. 监控 AI 流量 → 查看优化效果
```

---

## 🌐 面向的用户

- **Shopify 独立站商家** — 希望获取更多自然流量
- **DTC 品牌** — 需要在 AI 搜索中建立品牌存在感
- **SEO / 营销团队** — 需要面向 AI 搜索的优化工具
- **多 SKU 店铺** — 产品多、手动优化不现实，需要批量 AI 优化

---

> **Geofy — GEO (Generative Engine Optimization) for Shopify.**
>
> AI 搜索时代已经到来。你的产品准备好了吗？
