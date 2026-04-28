---
date: 2026-04-28
status: approved
---

# API 目录拆分 + 称号管理对接

## 背景

前端对接新的后端服务「锋楪核心」，需要将现有 API 层按后端服务分组，并新增管理员称号管理接口。

## 现状

- 所有 11 个 endpoint 文件均使用 `authApiClient`（→ `/api-auth` → localhost:5577）
- `mcApiClient`（→ `/api-mc` → localhost:5599）已配置但未使用
- `endpoints/` 和 `types/` 为扁平结构

## 方案

### 1. 目录拆分

**endpoints/**
- `api-auth/` ← 现有 11 个文件（全部使用 authApiClient）
- `api-mc/` ← 新增文件（使用 mcApiClient）

**types/**
- `api-auth/` ← auth.ts, user.ts, issue.ts
- `api-mc/` ← 新增 title.ts
- 根目录保留 response.ts（共用）、index.ts（re-export 入口）

### 2. 称号类型定义

```typescript
TitleType: 1=通用称号, 2=权限组称号, 3=玩家专属称号
TitleResponse: { id, name, description, type, permission_group, is_active, created_at }
CreateTitleRequest: { name, description, type, permission_group? }
UpdateTitleRequest: { name, description, type, permission_group?, is_active? }
AssignTitleRequest: { player_uuid }
```

### 3. 称号管理接口 (admin-title.ts)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /admin/titles | 分页查询列表 (page, page_size, type) |
| POST | /admin/titles | 创建称号 |
| GET | /admin/titles/{id} | 查询详情 |
| PUT | /admin/titles/{id} | 更新称号 |
| DELETE | /admin/titles/{id} | 删除称号 |
| POST | /admin/titles/{id}/assign | 分配称号 |
| DELETE | /admin/titles/{id}/assign | 撤销称号 |

所有接口使用 mcApiClient，对应 TanStack Query hooks。
