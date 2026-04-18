/**
 * 密码设置引导页
 *
 * 用户首次登录或 account_ready !== 'ready' 时被引导到此页面。
 * 设置游戏密码（用于 Minecraft 启动器认证）后跳转到用户仪表盘。
 *
 * 守卫逻辑：
 *   - 如果 account_ready === 'ready' → 直接跳转 /user/dashboard（无需设置）
 *   - 只有 account_ready === 'game_password' 才允许在此页面停留
 */

import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
} from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/form'
import { useUpdateGamePasswordMutation, useUserInfo } from '#/api/endpoints/user'

// ─── 表单数据类型 ──────────────────────────────────────────

interface SetupPasswordForm {
  new_password: string
  confirm_password: string
}

// ─── 路由定义（含 beforeLoad 守卫） ─────────────────────────

export const Route = createFileRoute('/setup/password')({
  component: SetupPasswordPage,
})

// ─── 页面组件 ──────────────────────────────────────────────

function SetupPasswordPage() {
  const navigate = useNavigate()
  const mutation = useUpdateGamePasswordMutation()
  const { data: userInfo } = useUserInfo()
  const [showNewPwd, setShowNewPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)

  // 页面内二次守卫：如果已经 ready 了（比如在另一个标签页设置了），立即跳走
  useEffect(() => {
    if (userInfo?.extend?.account_ready === 'ready') {
      navigate({ to: '/user/dashboard' as any })
    }
  }, [userInfo?.extend?.account_ready, navigate])

  const form = useForm<SetupPasswordForm>({
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
    mode: 'onBlur',
  })

  function onSubmit(data: SetupPasswordForm) {
    mutation.mutate(
      {
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      },
      {
        onSuccess: () => {
          toast.success('游戏密码设置成功')
          // 延迟跳转，让用户看到成功提示
          setTimeout(() => {
            navigate({ to: '/user/dashboard' as any })
          }, 500)
        },
        onError: () => {
          toast.error('密码设置失败，请稍后重试')
        },
      },
    )
  }

  return (
    <Card className="border-border/70 shadow-[0_16px_40px_-28px_oklch(0.18_0.025_195_/_0.18)]">
      <CardContent className="flex flex-col items-center pt-8 pb-8">
        {/* 图标 */}
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/10 mb-5">
          <Lock className="size-7 text-primary" />
        </div>

        {/* 标题区 */}
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground text-center">
          设置游戏密码
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-center max-w-[320px]">
          这是最后一步！设置你的游戏密码后，就可以在{' '}
          <span className="font-medium text-foreground">Minecraft 启动器</span>
          {' '}中使用此账户登录了。
        </p>

        {/* 表单 */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-7 w-full space-y-4"
          >
            <FormField
              control={form.control}
              name="new_password"
              rules={{
                required: '请输入密码',
                minLength: { value: 6, message: '密码至少需要 6 个字符' },
                maxLength: { value: 128, message: '密码最多 128 个字符' },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新游戏密码</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPwd ? 'text' : 'password'}
                        placeholder="输入新密码"
                        autoComplete="new-password"
                        className="pr-9 h-9"
                        disabled={mutation.isPending}
                        {...field}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowNewPwd(!showNewPwd)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-xs"
                      >
                        {showNewPwd ? '隐藏' : '显示'}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <p className="text-[11px] text-muted-foreground/70">
                    6-128 个字符
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              rules={{
                required: '请确认密码',
                validate: (value) =>
                  value === form.watch('new_password') || '两次输入的密码不一致',
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>确认新密码</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPwd ? 'text' : 'password'}
                        placeholder="再次输入密码"
                        autoComplete="new-password"
                        className="pr-9 h-9"
                        disabled={mutation.isPending}
                        {...field}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-xs"
                      >
                        {showConfirmPwd ? '隐藏' : '显示'}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-2 h-9"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? '设置中...' : '完成设置并继续'}
            </Button>

            <p className="text-[11px] text-center text-muted-foreground/50 pt-1">
              此密码仅用于 Minecraft 启动器认证，与网站登录无关
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
