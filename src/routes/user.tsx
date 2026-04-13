/**
 * 用户端布局路由
 * 所有 /user/* 路由此布局，包含认证守卫
 * 使用统一的 Layout (mode='user')
 */

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Layout } from '#/components/layout/layout'
import { checkIsAuthenticated } from '#/hooks/use-auth-guard'
import { userMenuItems } from '#/config/menu'

export const Route = createFileRoute('/user')({
  beforeLoad: ({ location }) => {
    // SSR 阶段跳过认证检查
    if (typeof document === 'undefined') return

    if (!checkIsAuthenticated()) {
      throw redirect({
        to: '/login' as any,
        search: { redirect: location.href } as any,
      })
    }
  },
  component: UserLayoutWrapper,
})

function UserLayoutWrapper() {
  return (
    <Layout mode="user" items={userMenuItems}>
      <Outlet />
    </Layout>
  )
}
