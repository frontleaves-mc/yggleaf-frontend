# PROJECT KNOWLEDGE BASE

**Generated:** 2026-05-26
**Commit:** ae4a9ac
**Branch:** master

## OVERVIEW

Yggleaf — Minecraft 服务器管理平台前端。React 19 + TanStack Router（文件路由）+ TanStack Query + Vite 8 + Tailwind CSS 4 + shadcn/ui。

## STRUCTURE

```
src/
├── api/            # 双后端 API 层（Auth + MC），含雪花 ID 精度保护
│   ├── endpoints/  # 按微服务分组的请求函数
│   └── types/      # 按微服务分组的类型定义
├── components/     # UI 组件（ui/landing/chat/issue/admin/dashboard/user/layout）
├── config/         # 全局常量（API URL、Token Key、应用信息）
├── content/        # 静态 Markdown 内容（社区规则、登录品牌文案）
├── hooks/          # 自定义 Hooks（auth、chat-stream、mobile、theme）
├── integrations/   # 第三方集成（TanStack Query 单例 QueryClient）
├── lib/            # 共享工具（auth-redirect、cookie、format、markdown、permissions）
├── routes/         # TanStack 文件路由（admin/ user/ 公共页面）
├── stores/         # TanStack Store 全局状态（auth、game-profile）
├── router.tsx      # 路由器工厂函数
├── main.tsx        # 入口（QueryClient + Router + Theme 初始化）
└── styles.css      # Tailwind 入口
```

## WHERE TO LOOK

| 任务 | 位置 | 备注 |
|------|------|------|
| 添加新页面 | `src/routes/` | TanStack 文件路由，自动生成 routeTree |
| 添加 API 接口 | `src/api/endpoints/` | 按 api-auth/api-mc 分组 |
| 添加类型定义 | `src/api/types/` | 与 endpoints 对应 |
| 添加 UI 组件 | `src/components/ui/` | shadcn/ui 组件 |
| 修改导航/菜单 | `src/lib/nav-links.ts` 或 `src/config/menu.ts` | 公共 vs 管理端 |
| 修改认证逻辑 | `src/stores/auth-store.ts` + `src/api/client.ts` | Token 存 Cookie |
| 修改全局常量 | `src/config/constants.ts` | API URL、Key 名等 |
| 添加自定义 Hook | `src/hooks/` | 认证、聊天流、游戏档案 |
| 修改构建配置 | `vite.config.ts` | 代理、代码分割、插件 |
| 部署 | `Makefile` + `script/upload.prod.sh` | rsync 部署 |

## CONVENTIONS

- **路径别名**: `#/*` 和 `@/*` 均指向 `./src/*`，代码中统一使用 `#/` 前缀
- **无分号**: Prettier 配置 `semi: false`
- **单引号**: Prettier 配置 `singleQuote: true`
- **尾随逗号**: Prettier 配置 `trailingComma: 'all'`
- **路由模式**: 文件系统路由（TanStack Router），`routeFileIgnorePattern: '^components$'`
- **状态管理**: 全局用 TanStack Store，服务端数据用 TanStack Query，局部原子用 Jotai
- **表单**: React Hook Form + Zod 校验
- **双后端**: Auth 后端（/api-auth）和 MC 后端（/api-mc），通过 Vite proxy 分流
- **雪花 ID**: Axios `transformResponse` 中自动将 ≥15 位数字包裹为字符串，防止 JS 精度丢失
- **Token 刷新**: 401 时自动用 RefreshToken 刷新，并发去重（共享 Promise）
- **语言**: UI 文案为简体中文

## ANTI-PATTERNS (THIS PROJECT)

- **禁止 `as any` / `@ts-ignore`**: 严格 TypeScript 模式
- **禁止管理员手动输入资源 ID**: 见下方 CRITICAL 约束
- **禁止在管理端使用 Input 填写关联资源 ID**: 必须用 Select/Combobox
- **`src/config/menu.ts`**: 存在 `@deprecated` 导出，使用 `adminMenuSections` / `userMenuSections` 替代旧导出
- **`src/components/ui/tanstack-table.tsx`**: 使用了 `as never` 类型断言，需要改进类型安全性

## UNIQUE STYLES

- 3D Minecraft 皮肤预览（skinview3d + react-skinview3d）
- SSE 聊天流（use-chat-stream.ts，自定义 EventSource 封装）
- 主题手动初始化（applyInitialTheme，同步 data-theme + CSS color-scheme）
- 精细代码分割（9 个 vendor 分组，优先级 1-30）
- Vite 使用 Rolldown 引擎（rolldownOptions，非标准 Rollup）

## COMMANDS

```bash
pnpm dev          # 开发服务器 :3000
pnpm build        # 生产构建
pnpm test         # Vitest（当前无测试文件）
pnpm lint         # ESLint
pnpm format       # Prettier 检查
pnpm check        # Prettier 写入 + ESLint 修复
make prod-upload  # 生产部署（rsync + gum）
```

## NOTES

- **无 CI/CD**: 没有 GitHub Actions，部署手动执行 `make prod-upload`
- **无 Docker**: 没有 Dockerfile 或容器化配置
- **无测试**: 配置了 Vitest + Testing Library 但无测试文件
- **部署依赖 gum**: `script/upload.prod.sh` 需要 charmbracelet/gum CLI 工具
- **代理配置**: 开发时 `/api-auth` → localhost:5577，`/api-mc` → localhost:5599

---

## Frontend Admin Constraints

### Admin ID Input Restriction (CRITICAL)

**前端管理端禁止任何形式的直接让管理员手动填写资源 ID 的行为。**

- 所有涉及资源关联（皮肤库、披风库、档案等）的操作，必须使用下拉选择器（Select / Combobox）展示可选项供管理员选择
- 如果当前没有可用的列表接口来获取可选项数据，必须暂停并询问用户，指出该缺陷，而非退而求其次使用 Input 手动填写 ID
- 此约束适用于所有管理员操作面板中的资源选择场景

**例外**: 仅当该 ID 是系统内部自动生成且无对应列表接口时（如日志追踪 ID），才允许 Input 输入，但必须在 placeholder 中明确说明格式要求
