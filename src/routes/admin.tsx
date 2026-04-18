/**
 * 管理后台布局路由
 * 所有 /admin/* 路由此布局，包含认证守卫
 * 使用统一的 Layout (mode='admin')
 */

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Layout } from '#/components/layout/layout'
import { checkIsAuthenticated } from '#/hooks/use-auth-guard'
import { adminMenuItems } from '#/config/menu'

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ location }) => {
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
    <Layout mode="admin" items={adminMenuItems}>
      <Outlet />
    </Layout>
  )
}
