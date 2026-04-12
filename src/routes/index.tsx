/**
 * 根路径 - 重定向到管理后台
 * 如果未登录，管理后台的 beforeLoad 会自动跳转到 /login
 */

import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/' as any })
  },
})
