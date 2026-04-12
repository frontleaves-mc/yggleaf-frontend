/**
 * 新建披风页
 * 表单创建新的披风资源
 */

import { createFileRoute } from '@tanstack/react-router'
import { useCreateCapeMutation } from '#/api/endpoints/cape-library'
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
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/admin/capes/create')({
  component: CreateCapePage,
})

function CreateCapePage() {
  const createMutation = useCreateCapeMutation()

  const [name, setName] = useState('')
  const [texture, setTexture] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMutation.mutateAsync({
        name,
        texture: Number(texture),
        is_public: isPublic,
      })
      window.location.href = '/admin/capes'
    } catch {
      // 错误由 mutation 处理
    }
  }

  return (
    <div className="admin-page-enter space-y-6">
      <Link
        to="/admin/capes"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        返回披风列表
      </Link>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-lg">新建披风</CardTitle>
          <CardDescription>填写披风信息以创建新的披风资源</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="cape-name">披风名称 *</Label>
              <Input
                id="cape-name"
                placeholder="请输入披风名称"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={createMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cape-texture">纹理文件 ID *</Label>
              <Input
                id="cape-texture"
                type="number"
                placeholder="请输入纹理文件 ID（雪花算法生成）"
                value={texture}
                onChange={(e) => setTexture(e.target.value)}
                required
                disabled={createMutation.isPending}
              />
              <p className="text-[12px] text-[var(--muted-foreground)]">
                上传纹理文件后系统会返回文件 ID，在此填入即可
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3.5">
              <div className="space-y-0.5">
                <Label htmlFor="cape-public" className="text-sm">公开披风</Label>
                <p className="text-[12px] text-[var(--muted-foreground)]">
                  开启后所有用户均可使用此披风
                </p>
              </div>
              <Switch
                id="cape-public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                disabled={createMutation.isPending}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Link to="/admin/capes">
                <Button variant="outline" type="button" disabled={createMutation.isPending}>取消</Button>
              </Link>
              <Button
                type="submit"
                disabled={createMutation.isPending || !name || !texture}
                className="bg-gradient-to-r from-[var(--lagoon)] to-[var(--lagoon-deep)] text-white hover:opacity-90 flex-1 sm:flex-none"
              >
                {createMutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />创建中...</>
                ) : (
                  <><Save className="mr-2 h-4 w-4" />创建披风</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
