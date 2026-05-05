import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import {
  usePublicAnnouncementDetail,
} from '#/api/endpoints/api-mc/public-announcement'
import { Badge } from '#/components/ui/badge'
import { MarkdownRenderer } from '#/components/ui/markdown-renderer'

const fadeUpItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

function typeBadgeVariant(
  type: number,
): { label: string; className: string } {
  return type === 1
    ? { label: '站内', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' }
    : { label: '全局', className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' }
}

export const Route = createFileRoute('/announcements/$id')({
  component: PublicAnnouncementDetailPage,
})

function PublicAnnouncementDetailPage() {
  const { id } = Route.useParams()
  const { data, isLoading } = usePublicAnnouncementDetail(id)

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
        >
          <motion.div variants={fadeUpItem}>
            <Link
              to="/announcements"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              返回列表
            </Link>
          </motion.div>

          {isLoading ? (
            <motion.div className="mt-8 space-y-4" variants={fadeUpItem}>
              <div className="h-8 w-3/5 rounded-lg bg-muted" />
              <div className="h-5 w-1/3 rounded bg-muted" />
              <div className="h-px bg-border/50" />
              <div className="space-y-2">
                {['a', 'b', 'c', 'd', 'e'].map((k) => (
                  <div
                    key={k}
                    className="h-4 w-full rounded bg-muted"
                    style={{ width: k <= 'b' ? '100%' : '85%' }}
                  />
                ))}
              </div>
            </motion.div>
          ) : data ? (
            <motion.div className="mt-8 space-y-6" variants={fadeUpItem}>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {data.title}
                </h1>
                <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                  <Badge variant="secondary" className={typeBadgeVariant(data.type).className}>
                    {typeBadgeVariant(data.type).label}
                  </Badge>
                  <span>发布于 {new Date(data.published_at).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>

              <hr className="border-border/60" />

              <MarkdownRenderer content={data.content ?? ''} />
            </motion.div>
          ) : (
            <motion.div
              className="mt-20 flex flex-col items-center justify-center text-muted-foreground"
              variants={fadeUpItem}
            >
              <p className="text-base">公告不存在</p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
