/**
 * 新建皮肤页（MC 风格）
 * 表单创建新的皮肤资源
 */

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useCreateSkinMutation } from '#/api/endpoints/api-auth/skin-library'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Switch } from '#/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Loader2, ArrowLeft, Save, Shirt } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useSetPageTitle } from '#/components/layout/page-title-context'
import { McCard } from '#/components/shared/mc-card'
import { McSectionHeader } from '#/components/shared/mc-section-header'

/** stagger 容器动画 - 子元素依次入场 */
const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

/** 单项淡入上移动画 */
const fadeUpItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export const Route = createFileRoute('/admin/skins/create')({
  component: CreateSkinPage,
})

function CreateSkinPage() {
  const createMutation = useCreateSkinMutation()
  const navigate = useNavigate()
  const setTitle = useSetPageTitle()

  const [name, setName] = useState('')
  const [model, setModel] = useState<string>('1')
  const [texture, setTexture] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  useEffect(() => {
    setTitle('创建皮肤')
    return () => setTitle(null)
  }, [setTitle])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMutation.mutateAsync({
        name,
        model: Number(model) as 1 | 2,
        texture: texture,
        is_public: isPublic,
      })
      navigate({ to: '/admin/skins' })
    } catch {
      // 错误由 mutation 处理
    }
  }

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUpItem}>
        <Link
          to="/admin/skins"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回皮肤列表
        </Link>
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <McCard variant="solid" color="nether" className="max-w-xl">
          <div className="p-6 pb-4">
            <McSectionHeader
              subtitle="Create New Skin"
              title="新建皮肤"
              icon={Shirt}
              variant="nether"
              description="填写皮肤信息以创建新的皮肤资源"
            />
          </div>
          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="space-y-2">
                <Label htmlFor="skin-model">模型类型 *</Label>
                <Select
                  value={model}
                  onValueChange={setModel}
                  disabled={createMutation.isPending}
                >
                  <SelectTrigger id="skin-model">
                    <SelectValue placeholder="选择模型类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Classic (Steve)</SelectItem>
                    <SelectItem value="2">Slim (Alex)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                <p className="text-[12px] text-muted-foreground">
                  上传纹理文件后系统会返回文件 ID，在此填入即可
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-3.5">
                <div className="space-y-0.5">
                  <Label htmlFor="skin-public" className="text-sm">
                    公开皮肤
                  </Label>
                  <p className="text-[12px] text-muted-foreground">
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

              <div className="flex gap-3 pt-2">
                <Link to="/admin/skins">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    disabled={createMutation.isPending}
                  >
                    取消
                  </Button>
                </Link>
                <Button
                  type="submit"
                  size="sm"
                  disabled={createMutation.isPending || !name || !texture}
                  className="flex-1 sm:flex-none"
                  variant="gradient"
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
          </div>
        </McCard>
      </motion.div>
    </motion.div>
  )
}
