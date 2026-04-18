/**
 * 用户端 - 问题详情页
 * 左侧：附件 + 回复对话 | 右侧：问题信息概览
 */

import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { LoadingPage } from '#/components/public/loading-page'
import { IssueStatusBadge } from '#/components/issue/issue-status-badge'
import { IssuePriorityBadge } from '#/components/issue/issue-priority-badge'
import { IssueAttachmentList } from '#/components/issue/issue-attachment-list'
import { IssueReplyList } from '#/components/issue/issue-reply-list'
import { IssueReplyForm } from '#/components/issue/issue-reply-form'
import { useIssueDetail } from '#/api/endpoints/issue'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { ArrowLeft, MessageSquare, FileQuestion, Paperclip, Clock } from 'lucide-react'
import { motion } from 'motion/react'
import type { IssueDetailResponse } from '#/api/types'

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

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function UserIssueDetailPage() {
  const { issueId } = useParams({ strict: false }) as { issueId: string }
  const { data: issueDetail, isLoading } = useIssueDetail(issueId)

  if (isLoading) return <LoadingPage />
  if (!issueDetail) return <div className="p-8 text-center text-muted-foreground">问题不存在</div>

  const { issue, issue_type, attachments } = issueDetail
  const isClosed = issue.status === 'closed'

  return (
    <motion.div
      className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 lg:px-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 页面头部 */}
      <motion.header variants={fadeUpItem} className="flex items-center gap-4">
        <Link
          to="/user/issues"
          className="group inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/80 text-muted-foreground shadow-sm transition-colors hover:border-primary/25 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/50 px-2.5 py-0.5 font-medium">
              <FileQuestion className="h-3 w-3" />
              Issue #{issue.id}
            </span>
          </div>
          <h1 className="mt-1 truncate text-lg font-semibold tracking-tight sm:text-xl">
            {issue.title}
          </h1>
        </div>
      </motion.header>

      {/* 主内容区 */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* 左侧：附件 + 对话 */}
        <motion.div variants={fadeUpItem} className="space-y-4 min-w-0">
          {/* 附件 */}
          {((attachments && attachments.length > 0) || !isClosed) && (
            <Card>
              <CardHeader className="border-b border-border/40 pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                  <Paperclip className="h-3.5 w-3.5" />
                  附件
                  {attachments.length > 0 && (
                    <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-semibold tabular-nums text-primary">
                      {attachments.length}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <IssueAttachmentList
                  attachments={attachments}
                  issueId={issue.id}
                  canUpload={!isClosed}
                  canDelete={true}
                />
              </CardContent>
            </Card>
          )}

          {/* 回复对话 */}
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
              <IssueReplyForm issueId={issue.id} disabled={isClosed} />
            </CardContent>
          </Card>
        </motion.div>

        {/* 右侧：问题信息 */}
        <motion.aside variants={fadeUpItem} className="lg:sticky lg:top-6 lg:self-start space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <IssueStatusBadge status={issue.status} />
                <IssuePriorityBadge priority={issue.priority} />
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {issue_type.name}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {/* 问题内容 */}
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">问题描述</p>
                <div className="text-sm leading-relaxed whitespace-pre-wrap break-words rounded-lg bg-muted/40 p-3">
                  {issue.content}
                </div>
              </div>

              {/* 时间信息 */}
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  提交于 {formatTime(issue.created_at)}
                </span>
                {issue.updated_at !== issue.created_at && (
                  <p className="inline-flex items-center gap-1.5">
                    更新于 {formatTime(issue.updated_at)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.aside>
      </div>
    </motion.div>
  )
}
