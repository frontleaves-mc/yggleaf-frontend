/**
 * 用户端布局路由
 * 所有 /user/* 路由此布局，包含认证守卫 + 账户就绪检查
 * 使用统一的 Layout (mode='user')
 */

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Layout } from '#/components/layout/layout'
import { checkIsAuthenticated } from '#/hooks/use-auth-guard'
import { getUserInfo } from '#/api/endpoints/user'
import { userMenuItems } from '#/config/menu'

export const Route = createFileRoute('/user')({
  beforeLoad: async ({ location }) => {
    // SSR 阶段跳过认证检查
    if (typeof document === 'undefined') return

    // 未登录 → 跳转登录
    if (!checkIsAuthenticated()) {
      throw redirect({
        to: '/login' as any,
        search: { redirect: location.href } as any,
      })
    }

    // 已登录但账户未就绪 → 引导到设置页（防止直接访问绕过）
    try {
      const userInfo = await getUserInfo()
      if (userInfo.extend?.account_ready !== 'ready') {
        throw redirect({ to: '/setup/password' as any })
      }
    } catch (e) {
      // 如果是重定向异常，直接抛出；其他错误（网络等）放行，由页面内处理
      if (e instanceof Response || (e && typeof e === 'object' && 'to' in e)) {
        throw e
      }
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
