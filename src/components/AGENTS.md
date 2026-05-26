# Components

## OVERVIEW

UI 组件库。`ui/` 为 shadcn/ui 基础组件（勿手动改），其余按功能域划分。

## STRUCTURE

```
ui/                    # shadcn/ui (36 files, radix-mira) — 仅通过 CLI 管理
├── color-picker.tsx   # react-colorful
├── markdown-*.tsx     # 编辑器/渲染器/分栏 (3 files)
├── tanstack-table.tsx # TanStack Table 封装
└── input-group.tsx    # 带前缀/后缀输入框
landing/               # 落地页 (13 files)：*-section.tsx + animate + primitives + layout
chat/                  # 聊天 (8 files)：container + messages + input(SSE) + conversations
issue/                 # 工单 (7 files)：badge + detail + reply + attachment + admin-actions
admin/server-load/     # ECharts 监控图表：gauge + resource-trend + tps-trend
dashboard/             # 仪表盘卡片 (3 files)
public/                # 通用页面组件 (8 files)：confirm-dialog, game-profile-selector, theme-toggle 等
shared/                # 跨域共享 (8 files)：Mc* 前缀组件 + quota-bar + secret-key-reveal
layout/                # 布局框架：Sidebar + TopBar + GlobalSearch + PageTitle
└── sidebar/           # 侧边栏：header + footer + menu-renderer + view-switcher
user/                  # 用户端组件：skin-preview(3D) + my/(resource-grid, upload-zone)
```

## WHERE TO LOOK

| 任务 | 位置 | 备注 |
|------|------|------|
| 添加 shadcn 组件 | `ui/` | 用 `pnpm dlx shadcn@latest add <name>` |
| 落地页新区块 | `landing/` | 新建 `*-section.tsx`，加入 `index.ts` 导出 |
| 聊天功能 | `chat/` | SSE 流在 `src/hooks/use-chat-stream.ts` |
| 工单状态/优先级 | `issue/issue-*-badge.tsx` | 状态映射在此定义 |
| 服务器监控图表 | `admin/server-load/` | ECharts |
| 皮肤/披风预览 | `user/skin-preview.tsx` | skinview3d |
| 颜色选择器 | `ui/color-picker.tsx` | react-colorful |
| Markdown 编辑 | `ui/markdown-*.tsx` | 编辑器/渲染器/分栏 |
| 侧边栏/全局搜索 | `layout/sidebar/` | 渲染逻辑在 `menu-renderer.tsx` |
| 共享 MC 风格组件 | `shared/index.ts` | McCard/McBadge/McIconBox/McSectionHeader |

## CONVENTIONS

- `ui/` 组件只通过 shadcn CLI 管理，不手动修改；如需定制样式，在调用侧用 className 覆盖
- `landing/` 和 `shared/` 有 `index.ts` 统一导出，新增组件必须同步更新
- `shared/` 组件以 `Mc` 前缀命名（McCard、McBadge），与 shadcn 的 `ui/` 区分
- `landing/` 动画原语（StaggerContainer 等）用于区块内交错动画效果
- `chat/` 组件依赖 `use-chat-stream` hook 处理 SSE，消息发送/接收不直接 fetch
- `layout/sidebar/menu-renderer.tsx` 消费 `src/config/menu.ts` 的菜单配置
- 3D 皮肤预览通过 `react-skinview3d` 包装，传入 skin URL 即可
