/**
 * OAuth2 SSO 回调页
 * SSO 提供商认证完成后重定向到此页面（带 code + state）
 * 处理流程：用授权码换 Token → 获取用户信息 → 跳转管理后台
 */

import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { handleOAuthCallback } from '#/api/endpoints/auth'
import { checkIsAuthenticated } from '#/hooks/use-auth-guard'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/callback')({
  beforeLoad: () => {
    // 已认证直接跳转（SSR 阶段跳过，等客户端 hydration 处理）
    if (typeof document !== 'undefined' && checkIsAuthenticated()) {
      throw redirect({ to: '/user/dashboard' as any })
    }
  },
  component: CallbackPage,
})

function CallbackPage() {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')

    if (!code || !state) {
      setError('缺少授权参数，请重新登录')
      return
    }

    // 清除 URL 中的授权参数（避免刷新重复提交）
    window.history.replaceState({}, '', '/callback')

    handleOAuthCallback(code, state)
      .then(() => {
        // 使用客户端路由跳转，保留内存中的 authStore 状态，避免 SSR 重新初始化
        const redirectTo = params.get('redirect') || '/user/dashboard'
        navigate({ to: redirectTo as any })
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : '登录失败，请重试')
      })
  }, [navigate])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-4 px-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <span className="text-xl text-destructive">!</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">登录失败</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary px-5 py-2.5 text-sm font-semibold text-white no-underline hover:opacity-90"
          >
            返回登录
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center">
          <p className="text-[15px] font-medium text-foreground">正在完成登录...</p>
          <p className="mt-1 text-[13px] text-muted-foreground">正在获取授权凭证并验证身份</p>
        </div>
      </div>
    </div>
  )
}
