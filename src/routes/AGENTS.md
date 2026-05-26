# Routes — TanStack File-Based Routing

## OVERVIEW

TanStack Router 文件路由目录。路由树由 `routeTree.gen.ts` 自动生成，禁止手动编辑该文件。

## STRUCTURE

```
src/routes/
├── __root.tsx                    # 根路由：TooltipProvider + Toaster + QueryClient 上下文
├── admin.tsx                     # 管理端布局（侧边栏），包裹 admin/ 下所有页面
├── user.tsx                      # 用户端布局（侧边栏），包裹 user/ 下所有页面
├── index.tsx                     # 落地页（公开）
├── login.tsx / callback.tsx      # 登录 + OAuth 回调
├── setup.tsx / setup/            # 初始化密码设置流程
├── about.tsx / rules.tsx         # 静态公开页面
├── announcements/                # 公开公告列表
├── admin/
│   ├── index.tsx                 # beforeLoad → 重定向至 admin/dashboard
│   ├── dashboard.tsx             # 管理仪表盘
│   ├── users/$userId.tsx         # 用户详情
│   ├── users/$userId_.game-profiles.tsx  # 用户游戏档案（平级路由）
│   ├── skins/ capes/ achievements/       # CRUD：index | create | $id
│   ├── issues/$issueId / issue-types/    # 工单系统
│   ├── messages/chat/ commands/          # 聊天 & 指令管理
│   ├── game-profiles/$profileId          # 游戏档案详情
│   ├── servers/ server-load/             # 服务器管理
│   ├── titles/                           # 称号管理
│   ├── plugin-credentials/$credentialId  # 插件凭据
│   └── announcement-schedules/           # 公告排期
└── user/
    ├── index.tsx                 # beforeLoad → 重定向至 user/dashboard
    ├── dashboard.tsx             # 用户仪表盘
    ├── my/ profile/ profiles/    # 个人信息 & 档案
    ├── skins/ capes/             # 皮肤 & 披风浏览
    ├── issues/$issueId           # 工单详情
    ├── chat/ commands/           # 聊天 & 指令
    ├── game-info/ map            # 游戏信息 & 地图
    └── my-titles/                # 我的称号
```

## ROUTING PATTERNS

- **布局路由**：`admin.tsx` / `user.tsx` 作为 layout route，子页面通过目录或带前缀文件组织
- **路径参数**：`$param` 语法（如 `$userId`、`$skinId`），在组件中通过 `Route.useParams()` 获取
- **平级子路由**：`$userId_.game-profiles.tsx` 使用下划线后缀（`_`）表示不嵌套，与 `$userId` 平级
- **认证守卫**：admin/user 的 `index.tsx` 通过 `beforeLoad` 重定向至对应 dashboard；实际权限校验在 `use-auth-guard` hook 中完成
- **路由忽略**：`components/` 目录被 `routeFileIgnorePattern` 排除，不会生成路由
- **自动代码分割**：`autoCodeSplitting: true`，每个路由文件独立 chunk

## CONVENTIONS

- 每个路由文件导出 `Route`（`createFileRoute` / `createLazyFileRoute`）和默认组件
- 页面数据获取优先使用 TanStack Query（`useQuery` / `useSuspenseQuery`），而非 route loader
- 管理端新增 CRUD 页面遵循 `index | create | $id` 三文件模式
- 需要认证的路由必须调用 `useAuthGuard()` 或在 `beforeLoad` 中检查权限
- 所有 UI 文案使用简体中文
- 新增路由文件后重启 dev server 以触发生成 `routeTree.gen.ts`
