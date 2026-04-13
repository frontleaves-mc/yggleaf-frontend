---
name: plan-creator
description: |
  前端开发与界面设计的计划辅助约束工具。当用户需要进行前端页面开发、UI 设计、
  组件构建、布局规划、交互流程设计，或任何涉及界面呈现的前端任务时触发此 skill。
  即使用户只是说"我想做一个页面"、"帮我规划一下"、"设计一下界面"，
  也应使用此 skill 来生成结构化的执行计划。
  此 skill 为 yggleaf-frontend 项目专用，会自动注入项目技术栈约束和设计规范。
---

# Plan Creator — Yggleaf Frontend 项目计划约束

你是 Yggleaf Frontend 项目的计划助手。你的职责是在用户进行前端开发或界面设计时，
生成一份结构化的执行计划，确保最终产出符合项目的技术栈、设计规范和代码风格。

## 项目技术栈约束

生成计划时，所有技术选型必须限定在以下范围内：

| 层面 | 技术 | 备注 |
|------|------|------|
| 框架 | React 19 | 函数组件 + Hooks |
| 路由 | TanStack Router (file-based) | 路由文件在 `src/routes/` |
| 状态管理 | TanStack Store | Store 在 `src/stores/` |
| 数据请求 | TanStack Query | 集成在 `src/integrations/` |
| 样式 | Tailwind CSS 4 | 自定义 CSS 变量体系 |
| UI 组件 | shadcn/ui (Radix) | 组件在 `src/components/ui/` |
| 表单 | react-hook-form + zod | 通过 `@hookform/resolvers` 集成 |
| 图标 | lucide-react | — |
| 通知 | sonner | — |
| 构建 | Vite 8 | — |
| 语言 | TypeScript (strict) | `#/*` 和 `@/*` 路径别名映射到 `src/*` |
| 包管理 | pnpm | — |

## 设计系统约束

项目使用 **"Yggdrasil Garden"** 设计系统，核心规范如下：

### 品牌色系
- **Lagoon** (`--lagoon` / `--lagoon-deep`): 主色调，用于品牌标识和交互强调
- **Palm** (`--palm`): 辅助绿，用于成功状态和辅助强调
- **Sea Ink** (`--sea-ink`): 深色文字/标题色
- **Sand / Foam**: 浅色背景层

### 表面层级
- `--surface`: 半透明磨砂玻璃效果 (82% 不透明度)
- `--surface-strong`: 更强的磨砂效果 (94% 不透明度)
- `--line`: 极细分隔线
- `--kicker`: 标注/高亮色

### 字体
- 正文字体: **Manrope** (sans-serif)
- 展示标题: **Fraunces** (serif，通过 `.display-title` class)

### 动效
- 按钮和链接: `transition 180ms ease`
- 页面入场: `.rise-in` / `.admin-page-enter` (280ms)
- 卡片悬浮: `.admin-card-hover` (translateY + box-shadow)

### 暗色模式
通过 `next-themes` 管理，所有 CSS 变量均在 `.dark` 下有对应覆盖值。
计划中涉及颜色时，必须同时考虑 light/dark 双模式。

## 计划生成流程

当用户提出前端开发或界面设计需求时，按以下步骤生成计划：

### 第一步：需求解析

分析用户需求，明确：
- 涉及哪些页面/路由
- 需要哪些 UI 组件（已有 vs 需新建）
- 是否涉及数据交互（API 调用、表单提交）
- 是否涉及权限控制

### 第二步：技术方案规划

基于需求，规划具体实现方案：
- 路由文件位置（`src/routes/` 下的文件结构）
- 组件拆分策略（页面级 → 布局级 → 业务组件 → UI 原子组件）
- 状态管理方案（Store vs URL State vs Query Cache）
- API 集成方式（endpoints 文件 → hooks → 组件）
- 表单验证方案（zod schema → react-hook-form）

### 第三步：设计规范注入

确保计划中的 UI 设计决策符合设计系统：
- 颜色使用必须引用 CSS 变量而非硬编码色值
- 间距、圆角遵循 `--radius` 体系
- 响应式断点以 Tailwind 默认为准 (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`)

### 第三步半：shadcn/ui 组件选型（使用 /shadcn skill）

**此步骤是强制性的。** UI 组件必须优先使用 shadcn/ui，而非手写。

在确定需要哪些 UI 组件后，调用 `/shadcn` skill 完成以下工作：

#### 计划阶段调用（推荐）

在生成计划的这一步就调用 `/shadcn` 来：
1. **查询已有组件** — 列出 `src/components/ui/` 中已安装的组件，避免重复安装
2. **搜索缺失组件** — 根据需求描述搜索 shadcn 注册表中的合适组件
3. **确认组件 API** — 查看目标组件的 Props、用法示例和变体

将结果写入计划的「shadcn 组件清单」中，格式如下：

```markdown
### shadcn 组件清单

| 组件名 | 状态 | 用途说明 |
|--------|------|----------|
| button | ✅ 已有 | 操作按钮 |
| dialog | ✅ 已有 | 弹窗确认 |
| table | ✅ 已有 | 数据列表 |
| select | ⚠️ 需安装 | 下拉筛选 |
| command | ❌ 新增 | 命令面板搜索 |
```

#### 执行阶段调用

如果计划阶段无法完全确定组件细节，也可以在实现步骤中标注：
> 使用 `/shadcn add <component-name>` 安装所需组件

两种模式均可接受，但**计划阶段完成组件选型更优**——可以提前发现依赖冲突、统一风格决策。

#### 选择原则

选择 shadcn 组件时遵循：
- **优先复用**：已安装的组件直接使用，不重复造轮子
- **按需安装**：只装需要的，不预装
- **Radix 底层**：优先选择基于 Radix Primitives 的组件（无障碍更好）
- **可组合性**：偏好原子组件而非过度封装的大组件

### 第四步：执行 frontend-design skill

**此步骤是强制性的。** 在计划的最终执行阶段，必须调用 `frontend-design` skill 来完成实际的界面构建工作。

在计划的最后一个阶段，明确写出：

> 使用 `/frontend-design` skill 执行界面构建，将上述设计方案转化为实际代码。

这确保了界面实现的质量和一致性，因为 `frontend-design` skill 具备专门的前端设计能力和最佳实践。

### 第五步：验证与收尾

列出验证清单：
- [ ] TypeScript 类型检查通过
- [ ] Light/Dark 模式表现正常
- [ ] 响应式布局在不同断点下表现正确
- [ ] 交互动效符合设计系统规范
- [ ] 无障碍访问基本合规（focus-visible, aria 标签）

## 计划输出模板

生成的计划应使用以下结构：

```markdown
# [功能名称] — 前端开发计划

## 需求概述
<!-- 一段话描述要做什么 -->

## 技术方案

### 路由结构
<!-- 文件路径和路由说明 -->

### 组件架构
<!-- 组件树/组件层级 -->

### 数据流
<!-- API 调用、状态管理、数据流向 -->

### UI 设计决策
<!-- 颜色、布局、动效等具体设计选择 -->

### shadcn 组件清单

| 组件名 | 状态 | 用途说明 |
|--------|------|----------|
| <!-- 已有组件 --> | ✅ 已有 | <!-- 用途 --> |
| <!-- 需安装组件 --> | ⚠️ 需安装 | <!-- 用途 --> |

> 注：组件选型通过 `/shadcn` skill 完成（查询已有 / 搜索注册表 / 确认 API）

## 实现步骤

1. <!-- 步骤 1：基础文件创建（路由、类型、API） -->
2. <!-- 步骤 2：安装缺失的 shadcn 组件（`pnpm dlx shadcn@latest add ...`） -->
3. <!-- 步骤 3：构建业务组件和页面结构 -->
...
N. **使用 `/frontend-design` skill 执行界面构建**

## 验证清单
- [ ] ...
```

## 代码风格约束

计划中涉及代码的部分，应遵循：
- 函数组件使用 `function` 声明而非箭头函数
- Props 类型使用 `interface` 定义，导出命名格式 `XXXProps`
- 事件处理函数命名 `handleXxx`
- 自定义 hooks 放在 `src/hooks/`，命名 `use-xxx.ts`
- API 类型定义在 `src/api/types/`
- API 端点在 `src/api/endpoints/`
- 共享组件在 `src/components/`，管理后台专用在 `src/components/admin/`
- Tailwind class 排序：布局 → 尺寸 → 间距 → 排版 → 颜色 → 交互状态
