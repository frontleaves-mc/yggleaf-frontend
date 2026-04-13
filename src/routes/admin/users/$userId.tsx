/**
 * 用户详情页
 * 查询单个用户的详细信息
 */

import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { PageTransition } from '#/components/ui/page-transition'

export const Route = createFileRoute('/admin/users/$userId')({
  component: UserDetailPage,
})

function UserDetailPage() {
  return (
    <PageTransition className="space-y-6">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        返回用户列表
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">用户详情</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-[var(--muted-foreground)]">
              用户详情接口正在对接中，完成后将展示完整的用户信息、角色权限、关联资源等。
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['用户 ID', '--'],
                ['用户名', '--'],
                ['邮箱', '--'],
                ['手机号', '--'],
                ['角色', '--'],
                ['封禁状态', '--'],
                ['注册时间', '--'],
                ['最后登录', '--'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-lg border border-[var(--border)] px-4 py-3">
                  <span className="text-[13px] text-[var(--muted-foreground)]">{label}</span>
                  <span className="text-[13px] font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  )
}
