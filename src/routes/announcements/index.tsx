import { createFileRoute, Link } from '@tanstack/react-router'
import { LogIn } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'motion/react'
import {
  usePublicAnnouncements,
} from '#/api/endpoints/api-mc/public-announcement'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { checkIsAuthenticated } from '#/hooks/use-auth-guard'

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const fadeUpItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const TYPE_TABS = [
  { label: '全部', value: undefined as number | undefined },
  { label: '站内', value: 1 },
  { label: '全局', value: 2 },
] as const

function typeBadgeVariant(
  type: number,
): { label: string; className: string } {
  return type === 1
    ? { label: '站内', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' }
    : { label: '全局', className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' }
}

export const Route = createFileRoute('/announcements/')({
  component: PublicAnnouncementsPage,
})

function PublicAnnouncementsPage() {
  const [activeType, setActiveType] = useState<number | undefined>(undefined)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data, isLoading } = usePublicAnnouncements({
    page,
    page_size: pageSize,
    type: activeType,
  })

  const list = data?.list ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const isAuthenticated = checkIsAuthenticated()

  const handleTypeChange = (value: number | undefined) => {
    setActiveType(value)
    setPage(1)
  }

  const truncateContent = (content: string | undefined | null, len = 100): string => {
    if (!content) return ''
    if (content.length <= len) return content
    return content.slice(0, len) + '...'
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.png"
              alt="Yggleaf"
              className="h-8 w-8 rounded-lg object-cover shadow-sm"
            />
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              公告中心
            </h1>
          </div>
          {!isAuthenticated && (
            <Link to="/login">
              <Button variant="outline" size="sm" className="gap-1.5">
                <LogIn className="h-3.5 w-3.5" />
                登录
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <motion.div
          className="mb-6 flex items-center gap-1 rounded-xl bg-muted/50 p-1"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => handleTypeChange(tab.value)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeType === tab.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {['a', 'b', 'c'].map((k) => (
              <div
                key={k}
                className="animate-pulse rounded-xl border border-border/50 bg-card p-5"
              >
                <div className="mb-2 h-5 w-2/5 rounded bg-muted" />
                <div className="mb-3 h-4 w-1/4 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : list.length > 0 ? (
          <motion.div
            className="space-y-3"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {list.map((item) => {
              const badge = typeBadgeVariant(item.type)
              return (
                <motion.div key={item.id} variants={fadeUpItem}>
                  <Link
                    to="/announcements/$id"
                    params={{ id: item.id }}
                    className="block cursor-pointer rounded-xl border border-border/50 bg-card p-5 transition-shadow duration-200 hover:shadow-md"
                  >
                    <div className="mb-2 flex items-center gap-2.5">
                      <Badge variant="secondary" className={badge.className}>
                        {badge.label}
                      </Badge>
                      <h3 className="flex-1 truncate text-[15px] font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {new Date(item.published_at).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {truncateContent(item.desc)}
                    </p>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-base">暂无公告</p>
          </motion.div>
        )}

        {!isLoading && totalPages > 1 && (
          <motion.div
            className="mt-8 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              上一页
            </Button>
            <span className="px-3 text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              下一页
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  )
}
