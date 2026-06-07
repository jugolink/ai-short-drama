# AIDrama Studio: SaaS 商业化重构计划 (Antigravity Handover Document)

> **Antigravity 提示词用法**：在另一台电脑打开此项目后，请直接对 Antigravity 输入：  
> *"请阅读 `docs/SaaS_Transformation_Plan.md`，理解本项目背景和接下来的 SaaS 商业化重构计划，并从第一阶段（Phase 1）开始执行。"*

---

## 1. 原项目架构与功能介绍 (Project Overview)

**项目名称**: AIDrama Studio (AI 短剧工作流平台)  
**项目来源**: 开源项目进行商业化闭源改造 (基于 Apache 2.0 协议)  
**核心功能**: 这是一个基于工作流的 AI 小说/短剧转视频自动生产平台。用户提供文本剧本或故事，系统可通过集成各类大模型（文本、音频 TTS、图像、视频生成）全自动编排生成分镜、配音、角色并最终合成视频。

### 核心技术栈 (Tech Stack)
- **全栈框架**: Next.js 15 (App Router, Turbopack)
- **数据库 ORM**: Prisma + MySQL 8.0
- **后台任务队列**: BullMQ + Redis (用于处理高延迟的异步生成任务)
- **对象存储**: MinIO (S3 协议兼容) / COS
- **UI 规范**: 基于 TailwindCSS 风格的自定义 CSS / NextUI / React 组件
- **多语言**: next-intl

### 现存机制需要注意的关键点
- **任务调度与重试 (BullMQ/Workers)**: 系统的核心是基于任务队列的 Worker 体系。所有的耗时操作（例如 `voice-design`、`video-generate` 等）都由专门的 Worker 异步处理，并在 DB 中记录 `Task` 和 `TaskEvent` 状态。
- **环境预设依赖**: 测试与校验系统非常严格。推送代码时会运行 `lint`、`typecheck` 和 `test:all`。由于这包含全量集成测试，修改核心模型代码时极易导致由于 `TaskEvent` 事件状态不同步引发的竞态条件报错（已在测试桩中做过初步修复）。
- **客户端水合 (Hydration)**: 项目采用严格的服务端渲染 (SSR)。为避免浏览器插件导致的水合不匹配，`<html>` 和 `<body>` 标签已配置 `suppressHydrationWarning`。

---

## 2. SaaS 商业化改造开发计划 (SaaS Transformation Plan)

目前项目处于“本地可运行且代码无错误推送”的基线状态。要将其打造为支持付费订阅和按量扣费的商业级 SaaS 平台，计划拆分为以下四个阶段进行（**请按顺序依次实施**）：

### 🟢 Phase 1: 账号与商业化鉴权体系改造 (Identity & Auth)
原开源版鉴权体系偏向本地和演示用途，需升级为商业级认证：
- **引入主流 Auth 方案**: 完善基于 `NextAuth.js` 或集成 Auth0 / Clerk 的商用方案。
- **增加手机号/微信扫码等本土化登录**: 取决于目标受众（国内或出海）。
- **完善团队与租户隔离**: 确保每个用户的项目（Project）、媒体资产（Assets）绝对隔离。

### 🟡 Phase 2: 全局积分账单与扣费系统闭环 (Billing & Credits System)
AI 生成的算力成本很高，系统需要对每个异步任务实行计费：
- **积分模型 (Credit Model)**: 在数据库设计 `UserWallet` 或 `CreditLedger` 表。
- **扣费拦截器**: 在 `src/lib/workers/` 各类 Worker 执行任务前（LLM 消耗、TTS 消耗、视频消耗），拦截并预扣除积分。
- **失败回滚**: 如果生成失败，必须保证积分的安全回滚（处理系统测试用例的 `billing-rollback` 逻辑）。

### 🟠 Phase 3: 模型服务商（Provider）对接与替换 (API Provider Overhaul)
原版内置了测试用或特定厂商（如 Bailian）的 API，需要替换为自己的商业账号配置：
- **配置面板**: 提供一个后台/前端页面供管理员或系统统一切换和输入底层模型 API Key（OpenAI, Anthropic, ElevenLabs, Runway/Kling 等）。
- **重写 Provider 实现**: 替换 `src/lib/providers/` 下的具体实现，使系统默认走客户自己的商业额度。

### 🔴 Phase 4: 支付网关接入 (Payment Gateway Integration)
- **国内/出海支付接入**: 接入 Stripe (海外) 或 微信/支付宝 (国内)。
- **订阅与包月逻辑**: 开发充值页面 (Pricing Page)，实现 `Webhook` 监听充值成功事件，自动为用户钱包增加积分或提升会员等级。
- **发票与流水**: 展示用户的资金消耗和账单历史。

---

## 3. 给 Antigravity 的操作建议 (Actionable Advice for Next Session)

- **前置沟通**: 在执行任何一个 Phase 的代码前，务必先同用户进行需求确认（比如：“您希望使用哪个支付网关？Stripe 还是支付宝？”）。
- **渐进式提交**: 每个子功能开发完成后，请确保跑通 `npm run test:all`，确保没有破坏原有复杂的工作流测试。
- **严格按照规范**: 这个项目的单元测试和集成测试覆盖率较高。在增加新的 `Billing` 或 `Auth` 逻辑时，同步撰写对应的测试用例（如在 `tests/unit/billing/` 中添加相应测试）以满足 CI/CD 和 `pre-push` 钩子。
