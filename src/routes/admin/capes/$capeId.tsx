/**
 * 编辑披风页
 * 编辑已有披风的属性信息
 */

import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '#/api/client'
import { useUpdateCapeMutation, useDeleteCapeMutation } from '#/api/endpoints/cape-library'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Switch } from '#/components/ui/switch'
import { Badge } from '#/components/ui/badge'
import { ConfirmDialog } from '#/components/admin/shared/ConfirmDialog'
import { Loader2, ArrowLeft, Save, Trash2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useParams } from '@tanstack/react-router'
import { useState } from 'react'
import type { CapeLibrary } from '#/api/types'

export const Route = createFileRoute('/admin/capes/$capeId')({
  component: EditCapePage,
})

/** 获取单个披风详情 */
async function getCapeDetail(capeId: string): Promise<CapeLibrary> {
  return apiClient.get<CapeLibrary>(`/library/capes/${capeId}`)
}

function EditCapePage() {
  const { capeId } = useParams({ strict: false }) as { capeId: string }
  const { data: cape, isLoading } = useQuery({
    queryKey: ['capes', capeId],
    queryFn: () => getCapeDetail(capeId),
  })

  const updateMutation = useUpdateCapeMutation(Number(capeId))
  const deleteMutation = useDeleteCapeMutation()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [name, setName] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  // 当数据加载完成后初始化表单
  if (cape && !name) {
    setName(cape.name)
    setIsPublic(cape.is_public)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateMutation.mutateAsync({
        name,
        is_public: isPublic,
      })
    } catch {
      // 错误由 mutation 处理
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(Number(capeId))
      window.location.href = '/admin/capes'
    } catch {
      // 错误处理
    }
  }

  if (isLoading) return <div className="admin-page-enter"><LoadingSkeleton /></div>

  if (!cape) return <div className="admin-page-enter text-center py-12 text-[var(--muted-foreground)]">披风不存在</div>

  return (
    <div className="admin-page-enter space-y-6">
      <Link
        to="/admin/capes"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        返回披风列表
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="max-w-xl lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">编辑披风</CardTitle>
                <CardDescription>修改披风 #{cape.id} 的属性信息</CardDescription>
              </div>
              <Badge variant="secondary" className="font-mono text-xs">
                ID: {cape.id}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="edit-cape-name">披风名称 *</Label>
                <Input
                  id="edit-cape-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={updateMutation.isPending}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3.5">
                <div className="space-y-0.5">
                  <Label className="text-sm">公开披风</Label>
                  <p className="text-[12px] text-[var(--muted-foreground)]">
                    开启后所有用户均可使用
                  </p>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} disabled={updateMutation.isPending} />
              </div>

              <div className="flex gap-3 pt-2">
                <Link to="/admin/capes">
                  <Button variant="outline" type="button" disabled={updateMutation.isPending}>取消</Button>
                </Link>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending || !name}
                  className="bg-gradient-to-r from-[var(--lagoon)] to-[var(--lagoon-deep)] text-white hover:opacity-90 flex-1 sm:flex-none"
                >
                  {updateMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />保存中...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" />保存修改</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">披风详情</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow label="ID" value={String(cape.id)} />
            <InfoRow label="纹理哈希" value={cape.texture_hash.slice(0, 12) + '...'} mono />
            <InfoRow label="创建者" value={cape.user?.username ?? '系统内置'} />
            <InfoRow
              label="更新时间"
              value={new Date(cape.updated_at).toLocaleString('zh-CN')}
            />

            <div className="pt-4 border-t border-[var(--border)]">
              <Button
                variant="destructive"
                className="w-full gap-1.5 text-sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4" />
                删除此披风
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="确认删除"
        description={`确定要删除披风「${cape.name}」吗？此操作不可撤销。`}
        confirmLabel="删除"
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        variant="destructive"
      />
    </div>
  )
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[13px] text-[var(--muted-foreground)] shrink-0">{label}</span>
      <span className={`text-[13px] font-medium break-all ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 max-w-xl">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-20 rounded bg-[var(--muted)] animate-pulse" />
          <div className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--card)] animate-pulse" />
        </div>
      ))}
    </div>
  )
}
