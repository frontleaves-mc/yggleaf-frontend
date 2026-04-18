/**
 * 管理员端 - 问题详情页
 * 复用用户端详情组件 + 管理员操作面板
 */

import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { LoadingPage } from '#/components/public/loading-page'
import { IssueDetailContent } from '#/components/issue/issue-detail-content'
import { IssueReplyList } from '#/components/issue/issue-reply-list'
import { IssueReplyForm } from '#/components/issue/issue-reply-form'
import { AdminIssueActions } from '#/components/issue/admin-issue-actions'
import { useIssueDetail } from '#/api/endpoints/issue'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { ArrowLeft, MessageSquare, FileQuestion } from 'lucide-react'
import { motion } from 'motion/react'

export const Route = createFileRoute('/admin/issues/$issueId')({
  component: AdminIssueDetailPage,
})

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

function AdminIssueDetailPage() {
  const { issueId } = useParams({ strict: false }) as { issueId: string }
  const { data: issueDetail, isLoading } = useIssueDetail(issueId)

  if (isLoading) return <LoadingPage />
  if (!issueDetail) return <div className="p-8 text-center text-muted-foreground">问题不存在</div>

  return (
    <motion.div
      className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 页面头部：返回 + 标题信息 */}
      <motion.header variants={fadeUpItem} className="flex items-center gap-4">
        <Link
          to="/admin/issues"
          className="group inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/80 text-muted-foreground shadow-sm transition-colors hover:border-primary/25 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/50 px-2.5 py-0.5 font-medium">
              <FileQuestion className="h-3 w-3" />
              Issue #{issueDetail.issue.id}
            </span>
          </div>
          <h1 className="mt-1 truncate text-lg font-semibold tracking-tight sm:text-xl">
            {issueDetail.issue.title}
          </h1>
        </div>
      </motion.header>

      {/* 主内容区 */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* 左侧：详情 + 回复 */}
        <motion.div variants={fadeUpItem} className="space-y-4 min-w-0">
          <IssueDetailContent
            issueDetail={issueDetail}
            canUpload={true}
            canDeleteAttachment={true}
          />

          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                回复
                {issueDetail.replies.length > 0 && (
                  <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-semibold tabular-nums text-primary">
                    {issueDetail.replies.length}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <IssueReplyList replies={issueDetail.replies} />
              <IssueReplyForm issueId={issueDetail.issue.id} />
            </CardContent>
          </Card>
        </motion.div>

        {/* 右侧：管理员操作 */}
        <motion.aside variants={fadeUpItem} className="lg:sticky lg:top-6 lg:self-start">
          <AdminIssueActions issue={issueDetail.issue} />
        </motion.aside>
      </div>
    </motion.div>
  )
}
