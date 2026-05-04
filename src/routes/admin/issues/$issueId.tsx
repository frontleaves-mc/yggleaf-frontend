/**
 * 管理员端 - 问题详情页
 * 复用用户端详情组件 + 管理员操作面板
 */

import { useEffect } from 'react'
import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { LoadingPage } from '#/components/public/loading-page'
import { IssueDetailContent, formatTime  } from '#/components/issue/issue-detail-content'
import { IssueStatusBadge } from '#/components/issue/issue-status-badge'
import { IssuePriorityBadge } from '#/components/issue/issue-priority-badge'
import { IssueReplyList } from '#/components/issue/issue-reply-list'
import { IssueReplyForm } from '#/components/issue/issue-reply-form'
import { AdminIssueActions } from '#/components/issue/admin-issue-actions'
import { useIssueDetail } from '#/api/endpoints/api-auth/issue'
import { ArrowLeft, MessageSquare, FileQuestion, Clock } from 'lucide-react'
import { motion } from 'motion/react'
import { useSetPageTitle } from '#/components/layout/page-title-context'

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
  const { issueId } = useParams({ strict: false })
  const { data: issueDetail, isLoading } = useIssueDetail(issueId)
  const setTitle = useSetPageTitle()

  useEffect(() => {
    if (issueDetail) setTitle(issueDetail.issue.title)
    return () => setTitle(null)
  }, [issueDetail, setTitle])

  if (isLoading) return <LoadingPage />
  if (!issueDetail)
    return (
      <div className="p-8 text-center text-muted-foreground">问题不存在</div>
    )

  return (
    <motion.div
      className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 页面头部：返回 + 徽章 + 时间 */}
      <motion.header variants={fadeUpItem} className="flex items-center gap-3">
        <Link
          to="/admin/issues"
          className="group inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/80 text-muted-foreground shadow-sm transition-colors hover:border-primary/25 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </Link>
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/50 px-2.5 py-0.5 font-medium text-xs text-muted-foreground">
            <FileQuestion className="h-3 w-3" />
            Issue #{issueDetail.issue.id}
          </span>
          <IssueStatusBadge status={issueDetail.issue.status} />
          <IssuePriorityBadge priority={issueDetail.issue.priority} />
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {issueDetail.issue_type.name}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground shrink-0">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            更新于 {formatTime(issueDetail.issue.updated_at)}
          </span>
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

          {/* 回复区域 */}
          <motion.div variants={fadeUpItem} className="space-y-4 pt-5">
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              回复
              {issueDetail.replies.length > 0 && (
                <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-semibold tabular-nums text-primary">
                  {issueDetail.replies.length}
                </span>
              )}
            </div>
            <IssueReplyList replies={issueDetail.replies} />
            <IssueReplyForm issueId={issueDetail.issue.id} />
          </motion.div>
        </motion.div>

        {/* 右侧：管理员操作 */}
        <motion.aside
          variants={fadeUpItem}
          className="lg:sticky lg:top-6 lg:self-start"
        >
          <AdminIssueActions issue={issueDetail.issue} />
        </motion.aside>
      </div>
    </motion.div>
  )
}
