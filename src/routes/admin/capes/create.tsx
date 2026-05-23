/**
 * 新建披风页（MC 风格）
 * 表单创建新的披风资源
 */

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useCreateCapeMutation } from '#/api/endpoints/api-auth/cape-library'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Switch } from '#/components/ui/switch'
import { Loader2, ArrowLeft, Save, Flag } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useSetPageTitle } from '#/components/layout/page-title-context'
import { McCard } from '#/components/shared/mc-card'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'

export const Route = createFileRoute('/admin/capes/create')({
  component: CreateCapePage,
})

function CreateCapePage() {
  const createMutation = useCreateCapeMutation()
  const navigate = useNavigate()
  const setTitle = useSetPageTitle()

  const [name, setName] = useState('')
  const [texture, setTexture] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  useEffect(() => {
    setTitle('创建披风')
    return () => setTitle(null)
  }, [setTitle])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMutation.mutateAsync({
        name,
        texture: texture,
        is_public: isPublic,
      })
      navigate({ to: '/admin/capes' })
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
          to="/admin/capes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回披风列表
        </Link>
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <McCard variant="solid" color="gold" className="max-w-xl">
          <div className="p-6 pb-4">
            <McSectionHeader
              subtitle="Create New Cape"
              title="新建披风"
              icon={Flag}
              variant="gold"
              description="填写披风信息以创建新的披风资源"
            />
          </div>
          <div className="px-6 pb-6">
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
                <p className="text-[12px] text-muted-foreground">
                  上传纹理文件后系统会返回文件 ID，在此填入即可
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-3.5">
                <div className="space-y-0.5">
                  <Label htmlFor="cape-public" className="text-sm">
                    公开披风
                  </Label>
                  <p className="text-[12px] text-muted-foreground">
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
                      创建披风
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
