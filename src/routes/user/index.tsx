/**
 * /user 索引路由 - 重定向到 dashboard
 */

import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/user/')({
  beforeLoad: () => {
    throw redirect({ to: '/user/dashboard' as any })
  },
})
