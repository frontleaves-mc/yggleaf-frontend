/**
 * 设置流程布局路由
 * 专用于 /setup/* 路径，提供无侧边栏的全屏居中布局
 * 用于账户初始化引导（如设置游戏密码）
 */

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { checkIsAuthenticated } from '#/hooks/use-auth-guard'

export const Route = createFileRoute('/setup')({
  beforeLoad: ({ location }) => {
    // 未登录 → 跳转登录
    if (!checkIsAuthenticated()) {
      throw redirect({
        to: '/login' as any,
        search: { redirect: location.href } as any,
      })
    }
  },
  component: SetupLayoutWrapper,
})

function SetupLayoutWrapper() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-8">
      <motion.div
        className="w-full max-w-[440px]"
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
        }}
      >
        <Outlet />
      </motion.div>
    </div>
  )
}
