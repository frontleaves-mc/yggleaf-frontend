---
date: 2026-04-28
status: approved
---

# 管理员称号管理界面设计

## 路由

- 新增 `src/routes/admin/titles/index.tsx`
- 路径：`/admin/titles`

## 菜单

在 `config/menu.ts` 的「游戏」分组下新增：
```
游戏 → 称号管理 (Tags) → /admin/titles
```

## 页面结构（单页 + Dialog）

### 列表（TanStack Table + 分页）

列：ID | 名称 | 描述 | 类型(Badge) | 权限组 | 状态(可切换) | 操作

类型 Badge 配色：
- 通用(1): blue | 权限组(2): purple | 专属(3): amber

### Dialog

1. 创建/编辑 — name, description, type(Select), permission_group
2. 分配 — player_uuid 输入
3. 删除确认 — ConfirmDialog

## 数据流

- `useAdminTitles(params)` — 分页列表
- `useCreateTitleMutation` / `useUpdateTitleMutation` / `useDeleteTitleMutation` — CRUD
- `useAssignTitleMutation` / `useRevokeTitleMutation` — 分配/撤销
