/**
 * 编辑公告页
 * 编辑已有公告的内容
 */

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Badge } from '#/components/ui/badge'
import { MarkdownSplitEditor } from '#/components/ui/markdown-split-editor'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { AnnouncementType } from '#/api/types/api-mc/announcement'

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const fadeUpItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export const Route = createFileRoute('/admin/announcements/$announcementId')({
  component: EditAnnouncementPage,
})

function EditAnnouncementPage() {
  const { announcementId } = useParams({ strict: false })
  const navigate = useNavigate()
  const { data: announcement, isLoading } =
    useAdminAnnouncementDetail(announcementId)

  const updateMutation = useUpdateAnnouncementMutation()
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formType, setFormType] = useState<string>('')
  const [initialized, setInitialized] = useState(false)

  if (announcement && !initialized) {
    setFormTitle(announcement.title)
    setFormContent(announcement.content)
    setFormType(String(announcement.type))
    setInitialized(true)
  }

  const isDirty = announcement
    ? formTitle !== announcement.title ||
      formContent !== announcement.content ||
      formType !== String(announcement.type)
    : false

  useBlocker({ shouldBlockFn: () => isDirty, enableBeforeUnload: true })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateMutation.mutateAsync({
        id: announcementId,
        data: {
          title: formTitle.trim(),
          content: formContent,
          type: Number(formType),
        },
      })
      toast.success('公告更新成功')
      navigate({ to: '/admin/announcements' })
    } catch {
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
      <div className="text-center py-12 text-muted-foreground">
        公告不存在
      </div>
    )

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 返回导航 */}
      <motion.div variants={fadeUpItem}>
        <Link
          to="/admin/announcements"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回公告列表
        </Link>
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 主表单 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">编辑公告</CardTitle>
                  <CardDescription>
                    修改公告 #{announcement.id} 的内容
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  ID: {announcement.id}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="space-y-2">
                  <Label>公告标题 *</Label>
                  <Input
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                    disabled={updateMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label>公告类型</Label>
                  <Select
                    value={formType}
                    onValueChange={setFormType}
                    disabled={updateMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">站内公告</SelectItem>
                      <SelectItem value="2">全局公告</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>公告内容 *</Label>
                  <MarkdownSplitEditor
                    value={formContent}
                    onChange={setFormContent}
                    placeholder="请输入公告内容..."
                    disabled={updateMutation.isPending}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Link to="/admin/announcements">
                    <Button
                      variant="outline"
                      type="button"
                      disabled={updateMutation.isPending}
                    >
                      取消
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={
                      updateMutation.isPending ||
                      !formTitle?.trim() ||
                      !formContent?.trim()
                    }
                    className="bg-gradient-to-r from-primary to-primary text-white hover:opacity-90 flex-1 sm:flex-none"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        保存修改
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 侧边信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">公告详情</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow label="ID" value={announcement.id} mono />
              <div className="flex items-start justify-between gap-3">
                <span className="text-[13px] text-muted-foreground shrink-0">
                  状态
                </span>
                {getAnnouncementStatusBadge(announcement.status)}
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[13px] text-muted-foreground shrink-0">
                  类型
                </span>
                {getAnnouncementTypeBadge(announcement.type)}
              </div>
              <InfoRow
                label="创建时间"
                value={new Date(announcement.created_at).toLocaleString(
                  'zh-CN',
                )}
              />
              <InfoRow
                label="发布时间"
                value={
                  announcement.published_at
                    ? new Date(announcement.published_at).toLocaleString(
                        'zh-CN',
                      )
                    : '未发布'
                }
              />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  )
}

function getAnnouncementTypeBadge(type: number) {
  const map: Record<number, { label: string; className: string }> = {
    [AnnouncementType.InSite]: {
      label: '站内',
      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    [AnnouncementType.Global]: {
      label: '全局',
      className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
  }
  const info = map[type] ?? {
    label: '未知',
    className: 'bg-muted text-muted-foreground',
  }
  return (
    <Badge variant="secondary" className={info.className}>
      {info.label}
    </Badge>
  )
}

function getAnnouncementStatusBadge(status: number) {
  const map: Record<number, { label: string; className: string }> = {
    1: {
      label: '草稿',
      className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    },
    2: {
      label: '已发布',
      className: 'bg-green-500/10 text-green-600 dark:text-green-400',
    },
    3: {
      label: '已下线',
      className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    },
  }
  const info = map[status] ?? {
    label: '未知',
    className: 'bg-muted text-muted-foreground',
  }
  return (
    <Badge variant="secondary" className={info.className}>
      {info.label}
    </Badge>
  )
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[13px] text-muted-foreground shrink-0">
        {label}
      </span>
      <span
        className={`text-[13px] font-medium break-all ${mono ? 'font-mono text-xs' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 max-w-xl">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          <div className="h-10 w-full rounded-md border border-border bg-card animate-pulse" />
        </div>
      ))}
    </div>
  )
}
