/**
 * /admin 索引路由 - 重定向到 dashboard
 */

import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/dashboard' as any })
  },
})
