import {
  createFileRoute,
  Link,
  useBlocker,
  useNavigate,
} from '@tanstack/react-router'
import { useCreateAnnouncementMutation } from '#/api/endpoints/api-mc/admin-announcement'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { MarkdownSplitEditor } from '#/components/ui/markdown-split-editor'
import { Loader2, ArrowLeft, Save, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { AnnouncementType } from '#/api/types/api-mc/announcement'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'
import { ConfirmDialog } from '#/components/public/confirm-dialog'
import { useSetPageTitle } from '#/components/layout/page-title-context'

export const Route = createFileRoute('/admin/announcements/create')({
  component: CreateAnnouncementPage,
})

function CreateAnnouncementPage() {
  const createMutation = useCreateAnnouncementMutation()
  const navigate = useNavigate()
  const setTitle = useSetPageTitle()

  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formType, setFormType] = useState<string>(
    String(AnnouncementType.InSite),
  )
  const isSubmittingRef = useRef(false)

  const isDirty =
    (formTitle !== '' ||
      formContent !== '' ||
      formType !== String(AnnouncementType.InSite)) &&
    !isSubmittingRef.current

  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: () => isDirty,
    withResolver: true,
    enableBeforeUnload: true,
  })

  useEffect(() => {
    setTitle('创建公告')
    return () => setTitle(null)
  }, [setTitle])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    isSubmittingRef.current = true
    try {
      await createMutation.mutateAsync({
        title: formTitle.trim(),
        content: formContent.trim(),
        type: Number(formType),
      })
      toast.success('公告创建成功')
      navigate({ to: '/admin/announcements' })
    } catch {
      isSubmittingRef.current = false
      toast.error('创建失败')
    }
  }

  return (
    <>
      <motion.div
        className="space-y-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* 页头：返回 + 标题 + 操作按钮 */}
        <motion.div variants={fadeUpItem}>
          <div className="flex items-center justify-between">
            <Link
              to="/admin/announcements"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              返回列表
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={createMutation.isPending}
                onClick={() => navigate({ to: '/admin/announcements' })}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                取消
              </Button>
              <Button
                size="sm"
                type="submit"
                form="create-announcement-form"
                disabled={
                  createMutation.isPending ||
                  !formTitle?.trim() ||
                  !formContent?.trim()
                }
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    创建中...
                  </>
                ) : (
                  <>
                    <Save className="mr-1.5 h-3.5 w-3.5" />
                    创建公告
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* 表单 */}
        <motion.div variants={fadeUpItem}>
          <form
            id="create-announcement-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* 标题 + 类型同行 */}
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="announcement-title">公告标题 *</Label>
                <Input
                  id="announcement-title"
                  placeholder="请输入公告标题"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  disabled={createMutation.isPending}
                />
              </div>
              <div className="w-36 space-y-2">
                <Label htmlFor="announcement-type">公告类型</Label>
                <Select
                  value={formType}
                  onValueChange={setFormType}
                  disabled={createMutation.isPending}
                >
                  <SelectTrigger id="announcement-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">站内公告</SelectItem>
                    <SelectItem value="2">全局公告</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 内容编辑器 */}
            <div className="space-y-2">
              <Label>公告内容 *</Label>
              <MarkdownSplitEditor
                value={formContent}
                onChange={setFormContent}
                placeholder="请输入公告内容..."
                disabled={createMutation.isPending}
              />
            </div>
          </form>
        </motion.div>
      </motion.div>

      <ConfirmDialog
        open={status === 'blocked'}
        onOpenChange={(open) => {
          if (!open) reset()
        }}
        title="未保存的更改"
        description="你有未保存的更改，确定要离开吗？离开后更改将丢失。"
        confirmLabel="离开"
        cancelLabel="继续编辑"
        variant="destructive"
        onConfirm={proceed}
      />
    </>
  )
}
