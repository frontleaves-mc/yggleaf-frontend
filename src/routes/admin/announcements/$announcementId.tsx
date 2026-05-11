import {
  createFileRoute,
  Link,
  useParams,
  useNavigate,
  useBlocker,
} from '@tanstack/react-router'
import {
  useAdminAnnouncementDetail,
  useUpdateAnnouncementMutation,
} from '#/api/endpoints/api-mc/admin-announcement'
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
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'
import {
  getAnnouncementTypeBadge,
  getAnnouncementStatusBadge,
} from '#/lib/announcement-helpers'
import { ConfirmDialog } from '#/components/public/confirm-dialog'
import { AnnouncementType } from '#/api/types/api-mc/announcement'
import { useSetPageTitle } from '#/components/layout/page-title-context'

export const Route = createFileRoute('/admin/announcements/$announcementId')({
  component: EditAnnouncementPage,
})

function EditAnnouncementPage() {
  const { announcementId } = useParams({ strict: false })
  const navigate = useNavigate()
  const { data: announcement, isLoading } =
    useAdminAnnouncementDetail(announcementId)
  const setTitle = useSetPageTitle()

  const updateMutation = useUpdateAnnouncementMutation()
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formType, setFormType] = useState<string>(
    String(AnnouncementType.InSite),
  )

  useEffect(() => {
    if (announcement) {
      setFormTitle(announcement.title)
      setFormContent(announcement.content)
      setFormType(String(announcement.type))
    }
  }, [announcement])

  useEffect(() => {
    if (announcement) setTitle(announcement.title)
    return () => setTitle(null)
  }, [announcement, setTitle])

  const isSubmittingRef = useRef(false)

  const isDirty = announcement
    ? (formTitle !== announcement.title ||
        formContent !== announcement.content ||
        formType !== String(announcement.type)) &&
      !isSubmittingRef.current
    : false

  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: () => isDirty,
    withResolver: true,
    enableBeforeUnload: true,
  })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    isSubmittingRef.current = true
    try {
      await updateMutation.mutateAsync({
        id: announcementId,
        data: {
          title: formTitle.trim(),
          content: formContent.trim(),
          type: Number(formType),
        },
      })
      toast.success('公告更新成功')
      navigate({ to: '/admin/announcements' })
    } catch {
      isSubmittingRef.current = false
      toast.error('更新失败')
    }
  }

  if (isLoading)
    return (
      <div>
        <LoadingSkeleton />
      </div>
    )

  if (!announcement)
    return (
      <div className="text-center py-12 text-muted-foreground">公告不存在</div>
    )

  return (
    <>
      <motion.div
        className="space-y-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* 页头：导航 + 标题 + 元信息 + 操作按钮 */}
        <motion.div variants={fadeUpItem}>
          <Link
            to="/admin/announcements"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            返回列表
          </Link>

          {/* 元信息行 + 操作按钮 */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span className="font-mono">ID: {announcement.id}</span>
              {getAnnouncementStatusBadge(announcement.status)}
              {getAnnouncementTypeBadge(announcement.type)}
              <span>
                创建于{' '}
                {new Date(announcement.created_at).toLocaleString('zh-CN')}
              </span>
              {announcement.published_at && (
                <span>
                  发布于{' '}
                  {new Date(announcement.published_at).toLocaleString('zh-CN')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={updateMutation.isPending}
                onClick={() => navigate({ to: '/admin/announcements' })}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                取消
              </Button>
              <Button
                size="sm"
                type="submit"
                form="edit-announcement-form"
                disabled={
                  updateMutation.isPending ||
                  !formTitle?.trim() ||
                  !formContent?.trim()
                }
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="mr-1.5 h-3.5 w-3.5" />
                    保存修改
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* 表单 */}
        <motion.div variants={fadeUpItem}>
          <form
            id="edit-announcement-form"
            onSubmit={handleUpdate}
            className="space-y-5"
          >
            {/* 标题 + 类型同行 */}
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Label className="mb-2">公告标题 *</Label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  disabled={updateMutation.isPending}
                />
              </div>
              <div className="w-36">
                <Label className="mb-2">公告类型</Label>
                <Select
                  value={formType}
                  onValueChange={setFormType}
                  disabled={updateMutation.isPending}
                >
                  <SelectTrigger className="w-full">
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
                disabled={updateMutation.isPending}
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

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-20 rounded bg-muted animate-pulse" />
      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          <div className="h-10 w-full rounded-md border border-border bg-card animate-pulse" />
        </div>
        <div className="w-36 space-y-2">
          <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          <div className="h-10 w-full rounded-md border border-border bg-card animate-pulse" />
        </div>
      </div>
      <div className="h-[500px] rounded-xl border border-border bg-card animate-pulse" />
    </div>
  )
}
