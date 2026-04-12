# Yggleaf 管理后台 - 设计文档

> 版本: 1.0 | 更新日期: 2026-04-13 | 状态: 已完成基础版开发

---

## 1. 项目概述

Yggleaf 管理后台是一个基于 **React 19 + TanStack Start** 的 Minecraft 资源管理平台前端，提供皮肤库、披风库等资源的统一管理能力，支持 OAuth 2.0 安全认证。

### 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | React / TanStack Start | 19 / latest |
| 路由 | TanStack Router (文件路由) | latest |
| 状态管理 | TanStack Store + TanStack Query | latest |
| 样式 | Tailwind CSS 4 (oklch) | 4.x |
| UI 组件库 | Shadcn UI (new-york) | latest |
| 图标 | Lucide React | latest |
| 语言 | TypeScript (strict) | 5.7 |
| 包管理器 | pnpm | - |

---

## 2. 整体架构

### 2.1 路由结构

```
__root.tsx                          ← HTML Shell (Header + Footer)
├── index.tsx                        ← /       公开首页
├── about.tsx                        ← /about  关于页
├── login.tsx                        ← /login  登录页（独立，无布局）
│
└── admin/
    ├── _layout.tsx                  ← 管理后台布局 (AdminLayout + Auth Guard)
    ├── index.tsx                    ← /admin           Dashboard 仪表盘
    ├── users/
    │   ├── index.tsx                ← /admin/users         用户列表
    │   └── $userId.tsx              ← /admin/users/:id    用户详情
    ├── game-profiles/
    │   ├── index.tsx                ← /admin/game-profiles     游戏档案列表
    │   └── $profileId.tsx           ← /admin/game-profiles/:id 档案详情
    ├── skins/
    │   ├── index.tsx                ← /admin/skins        皮肤列表
    │   ├── create.tsx               ← /admin/skins/create 新建皮肤
    │   └── $skinId.tsx             ← /admin/skins/:id   编辑皮肤
    ├── capes/
    │   ├── index.tsx                ← /admin/capes        披风列表
    │   ├── create.tsx               ← /admin/capes/create 新建披风
    │   └── $capeId.tsx             ← /admin/capes/:id   编辑披风
    └── profile/
        └── index.tsx                ← /admin/profile      个人设置
```

### 2.2 布局层级

```
RootDocument (__root.tsx)
├── Header (公共导航栏)
├── <Outlet /> (页面内容)
└── Footer (公共页脚)

AdminLayout (admin/_layout.tsx, 替代 Root 的 Header/Footer 区域)
├── Sidebar (w-260 展开 / w-68 折叠)
│   ├── SidebarHeader (Logo + 品牌名)
│   ├── SidebarMenu (可折叠菜单, 支持嵌套分组)
│   └── SidebarFooter (版本号 + 折叠按钮)
└── Main Area (flex-1)
    ├── TopBar (sticky, h-14, glass-morphism)
    │   ├── BreadcrumbNav (动态面包屑)
    │   └── UserDropdown (头像 + 下拉菜单)
    └── ContentArea (overflow-y-auto, p-5~8)
        └── <Outlet /> (页面内容)
```

### 2.3 目录结构

```
src/
├── api/                              # API 层
│   ├── client.ts                     # HTTP Client (fetch 封装)
│   ├── interceptors.ts               # 401 处理 + Token 刷新
│   ├── endpoints/
│   │   ├── auth.ts                   # 登录/注册/刷新/登出/改密
│   │   ├── user.ts                   # 用户信息
│   │   ├── game-profile.ts           # 游戏档案 CRUD
│   │   ├── skin-library.ts           # 皮肤库 CRUD
│   │   └── cape-library.ts           # 披风库 CRUD
│   └── types/
│       ├── auth.ts                   # TokenPair, LoginRequest 等
│       ├── user.ts                   # User, GameProfile, SkinLibrary...
│       ├── response.ts               # BaseResponse<T>, ApiError
│       └── index.ts                  # 统一导出
├── components/
│   ├── ui/                           # Shadcn UI 组件 (~20个)
│   └── admin/
│       ├── layout/                   # 管理后台布局组件 (10个)
│       │   ├── AdminLayout.tsx
│       │   ├── Sidebar.tsx
│       │   ├── SidebarHeader.tsx
│       │   ├── SidebarMenu.tsx
│       │   ├── SidebarMenuItem.tsx
│       │   ├── SidebarFooter.tsx
│       │   ├── TopBar.tsx
│       │   ├── BreadcrumbNav.tsx
│       │   ├── UserDropdown.tsx
│       │   └── ContentArea.tsx
│       └── shared/                   # 通用管理页面组件 (6个)
│           ├── PageHeader.tsx
│           ├── DataTable.tsx
│           ├── StatCard.tsx
│           ├── LoadingPage.tsx
│           ├── ErrorPage.tsx
│           └── ConfirmDialog.tsx
├── config/
│   ├── constants.ts                  # API_BASE_URL, Token Keys
│   └── menu.ts                       # 菜单配置 + 面包屑映射
├── hooks/
│   ├── use-auth.ts                   # 认证状态 Hook
│   ├── use-auth-guard.ts             # 路由守卫 (checkIsAuthenticated)
│   ├── use-sidebar.ts                # 侧边栏状态 Hook
│   └── use-token-refresh.ts          # Token 刷新 Hook
├── stores/
│   ├── auth-store.ts                 # 认证状态 (localStorage 持久化)
│   └── sidebar-store.ts              # 侧边栏折叠状态
├── routes/                           # TanStack Router 文件路由
├── styles.css                        # 全局样式 + CSS 变量 + Admin 样式
└── docs/
    └── admin-dashboard-design.md     # 本文档
```

---

## 3. 认证流程设计

### 3.1 Token 存储策略

| Key | 类型 | 用途 |
|-----|------|------|
| `yggleaf_access_token` | string | API 请求 Authorization Bearer Token |
| `yggleaf_refresh_token` | string | 刷新访问令牌 (Rotation 机制) |
| `yggleaf_user` | JSON | 用户信息缓存，减少重复请求 |

存储位置: `localStorage` (SPA 标准做法)

### 3.2 认证时序图

```
[应用启动] → initAuthState() → 读取 localStorage
  ├─ 有有效 Token → isAuthenticated = true
  └─ 无/过期 Token → isAuthenticated = false

[访问 /admin/*] → beforeLoad 守卫检查
  ├─ 已认证 → 渲染 <Outlet />
  └─ 未认证 → redirect /login?redirect=<当前URL>

[登录提交] → POST /sso/account/login/password
  → 存储 Token Pair (access + refresh)
  → 获取 /user info 缓存用户信息
  → redirect 到 ?redirect 参数 或 /admin

[API 请求返回 401] → 触发 Token Refresh (Promise 去重锁)
  ├─ 刷新成功 → 重试原请求
  └─ 刷新失败 → clearAuth() → redirect /login

[登出] → POST /sso/oauth/logout → clearAuth() → redirect /login
```

### 3.3 路由守卫实现

- **`admin/_layout.tsx`**: `beforeLoad` hook 中调用 `checkIsAuthenticated()`，未登录则 `redirect({ to: '/login' })`
- **`login.tsx`**: `beforeLoad` hook 中已登录则 `redirect({ to: '/admin/' })`

---

## 4. API 对接方案

### 4.1 HTTP Client (`api/client.ts`)

核心能力：
- 基于 `fetch` 零依赖封装
- 自动注入 `Authorization: Bearer <token>` 请求头
- 401 响应自动触发 Token Refresh (Promise 去重队列防并发)
- 统一响应解包：校验 `code === 200`，非 200 抛出 `ApiError`
- 提供 `get/post/patch/delete` 便捷方法

### 4.2 接口映射表 (19 个端点)

| 功能 | 方法 | 路径 | 认证 | 页面 |
|------|------|------|------|------|
| 密码登录 | POST | `/sso/account/login/password` | 公开 | Login |
| 邮箱注册 | POST | `/sso/account/register/email` | 公开 | - |
| 刷新令牌 | POST | `/sso/account/token/refresh` | 公开 | 拦截器自动 |
| 注销令牌 | POST | `/sso/account/token/revoke` | 需认证 | Logout |
| 修改密码 | POST | `/sso/account/password/change` | 需认证 | Profile |
| OAuth 登出 | POST | `/sso/oauth/logout` | 需认证 | Logout |
| 用户信息 | GET | `/user/info` | 需认证 | Dashboard/Profile |
| 创建游戏档案 | POST | `/game-profile` | 需认证 | GameProfiles |
| 修改用户名 | PATCH | `/game-profile/{id}/username` | 需认证 | GameProfiles |
| 皮肤列表 | GET | `/library/skins` | 需认证 | Skins |
| 创建皮肤 | POST | `/library/skins` | 需认证 | Skins/Create |
| 编辑皮肤 | PATCH | `/library/skins/{id}` | 需认证 | Skins/Edit |
| 删除皮肤 | DELETE | `/library/skins/{id}` | 需认证 | Skins |
| 披风列表 | GET | `/library/capes` | 需认证 | Capes |
| 创建披风 | POST | `/library/capes` | 需认证 | Capes/Create |
| 编辑披风 | PATCH | `/library/capes/{id}` | 需认证 | Capes/Edit |
| 删除披风 | DELETE | `/library/capes/{id}` | 需认证 | Capes |

### 4.3 标准响应格式

```typescript
interface BaseResponse<T> {
  code: number            // 200 = 成功
  message: string         // 人类可读描述
  context: string         // X-Request-UUID 追踪 ID
  error_message?: string  // 补充错误详情
  output?: string         // 输出标识 (Success/PARAMETER_ERROR...)
  overhead?: number       // 处理耗时 (微秒)
  data?: T                // 实际业务数据
}
```

---

## 5. 设计系统

### 5.1 色彩体系

项目采用 **Lagoon (青绿色)** 作为主色调，基于 oklch 色彩空间：

| Token | Light Mode | Dark Mode | 用途 |
|-------|-----------|-----------|------|
| `--lagoon` | `#4fb8b2` | `#4fb8b2` | 主色调 (按钮、链接、激活态) |
| `--lagoon-deep` | `#328f97` | `#328f97` | 深色辅助 (图标、渐变终点) |
| `--primary` | `oklch(0.21 0.006 285.885)` | 浅色反转 | 主要操作色 |
| `--sidebar-bg` | `oklch(0.985 0 0)` | `oklch(0.21 0.006 285.885)` | 侧边栏背景 |
| `--sidebar-fg` | `oklch(0.141 0.005 285.823)` | 浅色 | 侧边栏文字 |

### 5.2 设计语言: "Refined Organic Admin"

- **风格定位**: 精致有机的管理后台，避免冷硬的工业感
- **关键特征**:
  - 圆角卡片 (rounded-xl/2xl) + 微妙阴影
  - 渐变装饰元素 (lagoon → lagoon-deep)
  - Glass-morphism 顶栏 (backdrop-blur-md)
  - 左侧 3px 圆角激活指示条 (非整块高亮)
  - 流畅过渡动画 (cubic-bezier 0.22, 1, 0.36, 1))
  - 统计卡片 hover 时顶部渐变线显现
  - 图标区域 bg-gradient-to-br 柔和背景

### 5.3 响应式断点

| 断点 | 行为 |
|------|------|
| < 768px | 侧边栏变为 Sheet 抽屉式，内容区全宽 |
| 768px - 1024px | 侧边栏可折叠为纯图标模式 (w-68) |
| > 1024px | 侧边栏完全展开 (w-260)，双列内容布局 |

---

## 6. 菜单配置

```typescript
// src/config/menu.ts
const adminMenuItems = [
  { key: 'dashboard',   label: '仪表盘',   icon: LayoutDashboard, to: '/admin' },
  { key: 'users',       label: '用户管理', icon: Users,          to: '/admin/users' },
  { key: 'game',        label: '游戏',     icon: Gamepad2,       children: [
    { key: 'game-profiles', label: '游戏档案', icon: UserCircle, to: '/admin/game-profiles' },
  ]},
  { key: 'library',     label: '资源库',   icon: Shirt,         children: [
    { key: 'skins', label: '皮肤库', icon: Shirt,   to: '/admin/skins' },
    { key: 'capes', label: '披风库', icon: Flag,    to: '/admin/capes' },
  ]},
  { key: 'profile',     label: '个人设置', icon: Settings,       to: '/admin/profile' },
]
```

---

## 7. 开发状态总览

### 7.1 各模块完成度

| 模块 | 状态 | 说明 |
|------|------|------|
| Phase 1: 基础设施 | ✅ 完成 | Shadcn 组件、类型定义、配置文件 |
| Phase 2: API 层 | ✅ 完成 | Client、拦截器、19 个端点 Hooks |
| Phase 3: 布局组件 | ✅ 完成 | 10 个布局组件 + 6 个共享组件 |
| Phase 4: 路由 + 登录 | ✅ 完成 | 18 个路由文件、认证守卫、登录页 |
| Phase 5: Dashboard | ✅ 完成 | 统计卡片、快捷操作、真实数据对接 |
| Phase 6: CRUD 页面 | ✅ 完成 | 皮肤/披风完整 CRUD、档案/用户/设置占位 |
| Phase 7: 文档输出 | ✅ 完成 | 本设计文档 |

### 7.2 待完善项

- [ ] **用户列表接口**: 需要 API 提供用户列表查询端点
- [ ] **游戏档案列表接口**: 需要完整的分页列表端点
- [ ] **文件上传组件**: 皮肤/披风纹理文件上传 UI
- [ ] **分页功能**: DataTable 分页控件集成
- [ ] **搜索/筛选**: 资源列表的搜索和状态筛选
- [ ] **国际化 (i18n)**: 目前中文硬编码
- [ ] **单元测试**: 核心 Hook 和工具函数测试
- [ ] **E2E 测试**: 关键流程自动化测试

---

## 8. 开发注意事项

### 8.1 TanStack Router 注意事项

1. **路径尾部斜杠**: 文件路由生成的 `FileRoutesByPath` 类型中，目录索引路由使用尾部斜杠（如 `/admin/`），但 Link 的 `to` prop 使用无尾斜杠形式（如 `/admin`）
2. **路由树生成**: 新增/删除路由文件后需运行 `npx @tanstack/router-cli generate`
3. **Pathless 布局冲突**: `_public._layout.tsx` 与同层 `index.tsx` 会产生 `/` 路径冲突，公共页面直接放在根 routes 目录下
4. **导航方式**: 由于路由类型限制，跨模块导航使用 `window.location.href` 而非 `navigate({ to })`

### 8.2 TanStack Store v0.10 API

Store 的 `setState` 只接受函数形式 `(prev: T) => T`，不接受普通对象：
```typescript
// ✅ 正确
setAuthState((prev) => ({ ...prev, isAuthenticated: true }))
// ❌ 错误
setAuthState({ isAuthenticated: true })
```

### 8.3 CSS 变量作用域

Admin 页面通过 `body:has(.admin-layout)` 选择器覆盖公开页面的渐变背景，避免管理界面出现装饰性渐变。
