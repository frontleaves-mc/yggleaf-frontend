/**
 * 管理后台布局路由
 * 所有 /admin/* 路由此布局，包含认证守卫
 */

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AdminLayout } from '#/components/admin/layout/AdminLayout'
import { checkIsAuthenticated } from '#/hooks/use-auth-guard'

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ location }) => {
    // SSR 阶段跳过认证检查（document 不存在，Cookie 无法读取）
    // 等客户端 hydration 后再根据 authStore 状态判断
    if (typeof document === 'undefined') return

    if (!checkIsAuthenticated()) {
      throw redirect({
        to: '/login' as any,
        search: { redirect: location.href } as any,
      })
    }
  },
  component: AdminLayoutWrapper,
})

function AdminLayoutWrapper() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
