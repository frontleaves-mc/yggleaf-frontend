/**
 * 根路径 - 重定向到用户端首页
 * 如果未登录，/user 的 beforeLoad 会自动跳转到 /login
 */

import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/user' as any })
  },
})
