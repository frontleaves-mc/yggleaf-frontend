/**
 * 管理后台布局路由
 * 所有 /admin/* 路由此布局，包含认证守卫 + 管理员角色守卫
 * 使用统一的 Layout (mode='admin')
 */

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Layout } from '#/components/layout/layout'
import { ensureAuthenticated } from '#/hooks/use-auth-guard'
import { USER_INFO_QUERY_KEY, getUserInfo } from '#/api/endpoints/api-auth/user'
import { adminMenuSections } from '#/config/menu'
import { ADMIN_ROLES } from '#/lib/permissions'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ context, location }) => {
    if (!(await ensureAuthenticated())) {
      throw redirect({
        to: '/login' as any,
        search: { redirect: location.href } as any,
      })
    }

    try {
      const userInfo = await context.queryClient.fetchQuery({
        queryKey: USER_INFO_QUERY_KEY,
        queryFn: getUserInfo,
        staleTime: 5 * 60 * 1000,
      })
      if (!ADMIN_ROLES.includes(userInfo.user.role_name)) {
        throw redirect({ to: '/user/dashboard' as any })
      }
    } catch (error) {
      // TanStack Router 的 redirect 是一个具有 `to` 属性的对象，需要重新抛出
      if (error && typeof error === 'object' && 'to' in error) {
        throw error
      }
      // 其他错误（网络等）→ 视为无权限
      throw redirect({ to: '/user/dashboard' as any })
    }
  },
  component: AdminLayoutWrapper,
})

function AdminLayoutWrapper() {
  return (
    <Layout mode="admin" sections={adminMenuSections}>
      <Outlet />
    </Layout>
  )
}
