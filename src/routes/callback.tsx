/**
 * OAuth2 SSO 回调页
 * SSO 提供商认证完成后重定向到此页面（带 code + state）
 * 处理流程：用授权码换 Token → 获取用户信息 → 跳转管理后台
 */

import {
  createFileRoute,
  redirect,
  useNavigate,
  Link,
} from '@tanstack/react-router'
import { handleOAuthCallback } from '#/api/endpoints/api-auth/auth'
import { USER_INFO_QUERY_KEY } from '#/api/endpoints/api-auth/user'
import type { UserCurrentResponse } from '#/api/types'
import { checkIsAuthenticated } from '#/hooks/use-auth-guard'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/callback')({
  beforeLoad: () => {
    // 已认证直接跳转
    if (checkIsAuthenticated()) {
      throw redirect({ to: '/user/dashboard' as any })
    }
  },
  component: CallbackPage,
})

function CallbackPage() {
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    const redirectTo = params.get('redirect') || '/user/dashboard'

    if (!code || !state) {
      setErrorMsg('缺少授权参数，请重新登录')
      setStatus('error')
      return
    }

    let cancelled = false

    handleOAuthCallback(code, state, queryClient)
      .then(() => {
        if (cancelled) return

        window.history.replaceState({}, '', '/callback')

        const userInfo =
          queryClient.getQueryData<UserCurrentResponse>(USER_INFO_QUERY_KEY)
        if (userInfo && userInfo.extend?.account_ready !== 'ready') {
          navigate({ to: '/setup/password' as any })
          return
        }

        navigate({ to: redirectTo as any })
      })
      .catch((err) => {
        if (cancelled) return

        // Token 交换成功但后续步骤失败时，用户实际已认证
        // 直接尝试跳转，让目标页面的 guard 链处理后续逻辑
        if (checkIsAuthenticated()) {
          window.history.replaceState({}, '', '/callback')
          navigate({ to: redirectTo as any })
          return
        }

        setErrorMsg(
          err instanceof Error ? err.message : '登录失败，请重试',
        )
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [navigate, queryClient])

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-4 px-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <span className="text-xl text-destructive">!</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">登录失败</h2>
          <p className="text-sm text-muted-foreground">{errorMsg}</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary px-5 py-2.5 text-sm font-semibold text-white no-underline hover:opacity-90"
          >
            返回登录
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center">
          <p className="text-[15px] font-medium text-foreground">
            正在完成登录...
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            正在获取授权凭证并验证身份
          </p>
        </div>
      </div>
    </div>
  )
}
