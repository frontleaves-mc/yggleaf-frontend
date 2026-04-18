/**
 * 用户端布局路由
 * 所有 /user/* 路由此布局，包含认证守卫 + 账户就绪检查
 * 使用统一的 Layout (mode='user')
 */

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Layout } from '#/components/layout/layout'
import { checkIsAuthenticated } from '#/hooks/use-auth-guard'
import { useUserInfo } from '#/api/endpoints/user'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { userMenuItems } from '#/config/menu'

export const Route = createFileRoute('/user')({
  beforeLoad: ({ location }) => {
    // 未登录 → 跳转登录
    if (!checkIsAuthenticated()) {
      throw redirect({
        to: '/login' as any,
        search: { redirect: location.href } as any,
      })
    }
  },
  component: UserLayoutWrapper,
})

/** 账户就绪守卫：未就绪时引导到设置页（非阻塞，避免 beforeLoad 卡死） */
function AccountReadyGuard() {
  const navigate = useNavigate()
  const { data: userInfo } = useUserInfo()

  useEffect(() => {
    if (userInfo && userInfo.extend?.account_ready !== 'ready') {
      navigate({ to: '/setup/password' as any })
    }
  }, [userInfo?.extend?.account_ready, navigate])

  return null
}

function UserLayoutWrapper() {
  return (
    <Layout mode="user" items={userMenuItems}>
      <AccountReadyGuard />
      <Outlet />
    </Layout>
  )
}
