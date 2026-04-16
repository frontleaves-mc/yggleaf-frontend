/**
 * 安全设置页
 *
 * 用户可在此页面查看账户状态、修改游戏密码。
 * 游戏密码用于 Minecraft 启动器认证，与网站登录无关。
 */

import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Badge } from '#/components/ui/badge'
import { PageTransition } from '#/components/ui/page-transition'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/form'
import { useUserInfo, useUpdateGamePasswordMutation } from '#/api/endpoints/user'

// ─── 表单数据类型 ──────────────────────────────────────────

interface ChangePasswordForm {
  new_password: string
  confirm_password: string
}

// ─── 路由定义 ──────────────────────────────────────────────

export const Route = createFileRoute('/user/security')({
  component: SecurityPage,
})

// ─── 子组件：信息字段 ─────────────────────────────────────

function InfoField({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 px-4 py-3">
      {icon && <span className="mt-0.5 text-muted-foreground">{icon}</span>}
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 text-[11px] uppercase tracking-wide text-muted-foreground/70">
          {label}
        </p>
        <p className="break-all text-[14px] font-medium">{value}</p>
      </div>
    </div>
  )
}

// ─── 页面组件 ──────────────────────────────────────────────

function SecurityPage() {
  const { data: userInfo, isLoading } = useUserInfo()
  const mutation = useUpdateGamePasswordMutation()
  const [showNewPwd, setShowNewPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)

  const accountReady = userInfo?.extend?.account_ready ?? 'game_password'

  const form = useForm<ChangePasswordForm>({
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
    mode: 'onBlur',
  })

  function onSubmit(data: ChangePasswordForm) {
    mutation.mutate(
      {
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      },
      {
        onSuccess: () => {
          toast.success('游戏密码已更新')
          form.reset()
        },
        onError: () => {
          toast.error('密码更新失败，请稍后重试')
        },
      },
    )
  }

  if (isLoading) {
    return (
      <PageTransition className="animate-pulse space-y-6">
        <div className="h-8 w-40 rounded bg-muted" />
        <div className="max-w-xl space-y-4 rounded-xl border border-border p-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 w-full rounded bg-muted/50" />
          ))}
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="font-display text-[1.5rem] font-bold tracking-tight text-foreground">
          安全设置
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          管理你的游戏密码和账户安全选项
        </p>
      </div>

      {/* 账户状态卡片 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">账户状态</CardTitle>
          <CardDescription>当前账户完善状态</CardDescription>
        </CardHeader>
        <CardContent>
          <InfoField
            icon={
              accountReady === 'ready' ? (
                <ShieldCheck className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )
            }
            label="就绪状态"
            value={
              <span className="flex items-center gap-2">
                {accountReady === 'ready' ? (
                  <>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                    >
                      已就绪
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      所有必需信息已完成
                    </span>
                  </>
                ) : (
                  <>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                    >
                      待完善
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      需要设置游戏密码
                    </span>
                  </>
                )}
              </span>
            }
          />
        </CardContent>
      </Card>

      {/* 修改游戏密码卡片 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="size-4.5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">修改游戏密码</CardTitle>
              <CardDescription>
                更新你在 Minecraft 启动器中使用的认证密码
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 max-w-md"
            >
              <div className="grid grid-cols-2 gap-3">
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
                      <FormLabel>新密码</FormLabel>
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
                      <FormLabel>确认密码</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPwd ? 'text' : 'password'}
                            placeholder="再次输入"
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
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  size="sm"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? '更新中...' : '更新密码'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageTransition>
  )
}
