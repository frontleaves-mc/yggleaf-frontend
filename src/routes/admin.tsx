/**
 * 管理后台布局路由
 * 所有 /admin/* 路由此布局，包含认证守卫 + 管理员角色守卫
 * 使用统一的 Layout (mode='admin')
 */

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Layout } from '#/components/layout/layout'
import { checkIsAuthenticated } from '#/hooks/use-auth-guard'
import { getUserInfo } from '#/api/endpoints/user'
import { adminMenuItems } from '#/config/menu'
import { ADMIN_ROLES } from '#/lib/permissions'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    // 1. 未登录 → 跳转登录
    if (!checkIsAuthenticated()) {
      throw redirect({
        to: '/login' as any,
        search: { redirect: location.href } as any,
      })
    }

    // 2. 已登录但非管理员 → 跳转用户首页
    try {
      const userInfo = await getUserInfo()
      if (!ADMIN_ROLES.includes(userInfo.user.role_name)) {
        throw redirect({ to: '/user/dashboard' as any })
      }
    } catch {
      // 获取用户信息失败时视为无权限
      throw redirect({ to: '/user/dashboard' as any })
    }
  },
  component: AdminLayoutWrapper,
})

function AdminLayoutWrapper() {
  return (
    <Layout mode="admin" items={adminMenuItems}>
      <Outlet />
    </Layout>
  )
}
