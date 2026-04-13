/**
 * 新建皮肤页
 * 表单创建新的皮肤资源
 */

import { createFileRoute } from '@tanstack/react-router'
import { useCreateSkinMutation } from '#/api/endpoints/skin-library'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { PageTransition } from '#/components/ui/page-transition'

export const Route = createFileRoute('/admin/skins/create')({
  component: CreateSkinPage,
})

function CreateSkinPage() {
  const createMutation = useCreateSkinMutation()

  const [name, setName] = useState('')
  const [model, setModel] = useState<string>('1')
  const [texture, setTexture] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMutation.mutateAsync({
        name,
        model: Number(model) as 1 | 2,
        texture: Number(texture),
        is_public: isPublic,
      })
      // 成功后跳转到列表页
      window.location.href = '/admin/skins'
    } catch {
      // 错误由 mutation 处理
    }
  }

  return (
    <PageTransition className="space-y-6">
      {/* 返回导航 */}
      <Link
        to="/admin/skins"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        返回皮肤列表
      </Link>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-lg">新建皮肤</CardTitle>
          <CardDescription>填写皮肤信息以创建新的皮肤资源</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 名称 */}
            <div className="space-y-2">
              <Label htmlFor="skin-name">皮肤名称 *</Label>
              <Input
                id="skin-name"
                placeholder="请输入皮肤名称"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={createMutation.isPending}
              />
            </div>

            {/* 模型 */}
            <div className="space-y-2">
              <Label htmlFor="skin-model">模型类型 *</Label>
              <Select value={model} onValueChange={setModel} disabled={createMutation.isPending}>
                <SelectTrigger id="skin-model">
                  <SelectValue placeholder="选择模型类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Classic (Steve)</SelectItem>
                  <SelectItem value="2">Slim (Alex)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 纹理 ID */}
            <div className="space-y-2">
              <Label htmlFor="skin-texture">纹理文件 ID *</Label>
              <Input
                id="skin-texture"
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

            {/* 公开设置 */}
            <div className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3.5">
              <div className="space-y-0.5">
                <Label htmlFor="skin-public" className="text-sm">公开皮肤</Label>
                <p className="text-[12px] text-[var(--muted-foreground)]">
                  开启后所有用户均可使用此皮肤
                </p>
              </div>
              <Switch
                id="skin-public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                disabled={createMutation.isPending}
              />
            </div>

            {/* 提交按钮 */}
            <div className="flex gap-3 pt-2">
              <Link to="/admin/skins">
                <Button variant="outline" type="button" disabled={createMutation.isPending}>
                  取消
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={createMutation.isPending || !name || !texture}
                className="bg-gradient-to-r from-[var(--diamond)] to-[var(--diamond-deep)] text-white hover:opacity-90 flex-1 sm:flex-none"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    创建中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    创建皮肤
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageTransition>
  )
}
