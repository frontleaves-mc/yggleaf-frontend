/**
 * 用户端 - 问题详情页 (MC 风格)
 * 双栏布局：左侧描述+回复，右侧附件（sticky）
 */

import { useEffect } from 'react'
import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { LoadingPage } from '#/components/public/loading-page'
import { IssueStatusBadge } from '#/components/issue/issue-status-badge'
import { IssuePriorityBadge } from '#/components/issue/issue-priority-badge'
import { MarkdownRenderer } from '#/components/ui/markdown-renderer'
import { IssueAttachmentList } from '#/components/issue/issue-attachment-list'
import { IssueReplyList } from '#/components/issue/issue-reply-list'
import { IssueReplyForm } from '#/components/issue/issue-reply-form'
import { useIssueDetail } from '#/api/endpoints/api-auth/issue'
import {
  ArrowLeft,
  MessageSquare,
  FileQuestion,
  Clock,
  Paperclip,
} from 'lucide-react'
import { motion } from 'motion/react'
import { formatTime } from '#/components/issue/issue-detail-content'
import { useSetPageTitle } from '#/components/layout/page-title-context'
import { McCard } from '#/components/shared/mc-card'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { McBadge } from '#/components/shared/mc-badge'
import { McIconBox } from '#/components/shared/mc-icon-box'

export const Route = createFileRoute('/user/issues/$issueId')({
  component: UserIssueDetailPage,
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

function UserIssueDetailPage() {
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

  const { issue, attachments } = issueDetail
  const isClosed = issue.status === 'closed'

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
          to="/user/issues"
          className="group inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/80 text-muted-foreground shadow-sm transition-colors hover:border-primary/25 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </Link>
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <McIconBox variant="diamond" size="sm">
            <FileQuestion />
          </McIconBox>
          <span className="text-xs font-medium text-muted-foreground">
            #{issue.id}
          </span>
          <IssueStatusBadge status={issue.status} />
          <IssuePriorityBadge priority={issue.priority} />
          <McBadge variant="default">
            {issueDetail.issue_type.name}
          </McBadge>
        </div>
        <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground shrink-0">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            更新于 {formatTime(issue.updated_at)}
          </span>
        </div>
      </motion.header>

      {/* 主内容区：双栏 */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* 左侧：描述 + 回复 */}
        <motion.div variants={fadeUpItem} className="space-y-4 min-w-0">
          {/* 问题描述 Card */}
          <McCard variant="glass" color="diamond" className="p-5">
            <McSectionHeader
              title="问题描述"
              icon={MessageSquare}
              variant="diamond"
              className="mb-4"
            />
            <MarkdownRenderer content={issue.content} className="text-sm" />
          </McCard>

          {/* 回复区域 */}
          <div className="space-y-4 pt-5">
            <McSectionHeader
              title={`回复${issueDetail.replies.length > 0 ? ` (${issueDetail.replies.length})` : ''}`}
              icon={MessageSquare}
              variant="grass"
            />
            <IssueReplyList replies={issueDetail.replies} />
            <IssueReplyForm issueId={issue.id} disabled={isClosed} />
          </div>
        </motion.div>

        {/* 右侧：附件面板 (sticky) */}
        <motion.aside
          variants={fadeUpItem}
          className="lg:sticky lg:top-6 lg:self-start"
        >
          <McCard variant="glass" color="gold" className="p-5">
            <McSectionHeader
              title={`附件${attachments.length > 0 ? ` (${attachments.length})` : ''}`}
              icon={Paperclip}
              variant="gold"
              className="mb-4"
            />
            <IssueAttachmentList
              attachments={attachments}
              issueId={issue.id}
              canUpload={!isClosed}
              canDelete={true}
            />
          </McCard>
        </motion.aside>
      </div>
    </motion.div>
  )
}
