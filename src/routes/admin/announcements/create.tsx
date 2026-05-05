/**
 * 创建公告页
 * 表单创建新的公告
 */

import { createFileRoute, Link, useBlocker, useNavigate } from '@tanstack/react-router'
import { useCreateAnnouncementMutation } from '#/api/endpoints/api-mc/admin-announcement'
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
import { MarkdownSplitEditor } from '#/components/ui/markdown-split-editor'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { AnnouncementType } from '#/api/types/api-mc/announcement'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'

export const Route = createFileRoute('/admin/announcements/create')({
  component: CreateAnnouncementPage,
})

function CreateAnnouncementPage() {
  const createMutation = useCreateAnnouncementMutation()
  const navigate = useNavigate()

  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formType, setFormType] = useState<string>(
    String(AnnouncementType.InSite),
  )

  const isDirty =
    formTitle !== '' ||
    formContent !== '' ||
    formType !== String(AnnouncementType.InSite)

  useBlocker({ shouldBlockFn: () => isDirty, enableBeforeUnload: true })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMutation.mutateAsync({
        title: formTitle.trim(),
        content: formContent.trim(),
        type: Number(formType),
      })
      toast.success('公告创建成功')
      navigate({ to: '/admin/announcements' })
    } catch {
      toast.error('创建失败')
    }
  }

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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">创建公告</CardTitle>
            <CardDescription>填写公告信息以创建新公告</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 标题 */}
              <div className="space-y-2">
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

              {/* 类型 */}
              <div className="space-y-2">
                <Label htmlFor="announcement-type">公告类型</Label>
                <Select
                  value={formType}
                  onValueChange={setFormType}
                  disabled={createMutation.isPending}
                >
                  <SelectTrigger id="announcement-type">
                    <SelectValue placeholder="选择公告类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">站内公告</SelectItem>
                    <SelectItem value="2">全局公告</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 内容 */}
              <div className="space-y-2">
                <Label>公告内容 *</Label>
                <MarkdownSplitEditor
                  value={formContent}
                  onChange={setFormContent}
                  placeholder="请输入公告内容..."
                  disabled={createMutation.isPending}
                />
              </div>

              {/* 提交按钮 */}
              <div className="flex gap-3 pt-2">
                <Link to="/admin/announcements">
                  <Button
                    variant="outline"
                    type="button"
                    disabled={createMutation.isPending}
                  >
                    取消
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending ||
                    !formTitle?.trim() ||
                    !formContent?.trim()
                  }
                  className="bg-gradient-to-r from-primary to-primary text-white hover:opacity-90 flex-1 sm:flex-none"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      创建中...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      创建公告
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
