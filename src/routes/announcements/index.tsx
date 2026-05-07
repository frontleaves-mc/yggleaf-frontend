import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import { usePublicAnnouncements } from '#/api/endpoints/api-mc/public-announcement'
import { Button } from '#/components/ui/button'
import { LandingLayout } from '#/components/landing/landing-layout'
import { LandingNavbar } from '#/components/landing/landing-navbar'
import { LandingFooter } from '#/components/landing/landing-footer'
import { LandingSection } from '#/components/landing/landing-section'
import { LandingCard } from '#/components/landing/landing-primitives'
import { getAnnouncementTypeBadge } from '#/lib/announcement-helpers'
import { scrollRevealContainer, scrollRevealItem } from '#/lib/motion-presets'

const TYPE_TABS = [
  { label: '全部', value: undefined as number | undefined },
  { label: '站内', value: 1 },
  { label: '全局', value: 2 },
] as const

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

  const handleTypeChange = (value: number | undefined) => {
    setActiveType(value)
    setPage(1)
  }

  const truncateContent = (
    content: string | undefined | null,
    len = 100,
  ): string => {
    if (!content) return ''
    if (content.length <= len) return content
    return content.slice(0, len) + '...'
  }

  return (
    <LandingLayout>
      <LandingNavbar />
      <main>
        <LandingSection
          title="公告中心"
          subtitle="了解锋楪最新动态、更新与重要通知"
        >
          <div className="mx-auto max-w-(--page-max) px-4 sm:px-6 lg:px-8">
            <motion.div
              className="mb-8 flex items-center gap-1 rounded-xl bg-muted/50 p-1 w-fit"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {TYPE_TABS.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => handleTypeChange(tab.value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeType === tab.value
                      ? 'bg-background text-foreground shadow-sm border border-border/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
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
                    className="animate-pulse rounded-2xl border border-border/50 bg-card p-6 shadow-sm"
                  >
                    <div className="mb-3 h-5 w-20 rounded bg-muted" />
                    <div className="mb-2 h-6 w-3/5 rounded bg-muted" />
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : list.length > 0 ? (
              <motion.div
                className="space-y-4"
                variants={scrollRevealContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
              >
                {list.map((item) => (
                  <motion.div key={item.id} variants={scrollRevealItem}>
                    <Link
                      to="/announcements/$id"
                      params={{ id: item.id }}
                      className="block cursor-pointer"
                    >
                      <LandingCard accent="diamond">
                        <div className="p-6">
                          <div className="mb-3 flex items-center gap-3">
                            {getAnnouncementTypeBadge(item.type)}
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {item.published_at
                                ? new Date(
                                    item.published_at,
                                  ).toLocaleDateString('zh-CN')
                                : '-'}
                            </span>
                          </div>
                          <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
                            {item.title}
                          </h3>
                          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                            {truncateContent(item.desc)}
                          </p>
                        </div>
                      </LandingCard>
                    </Link>
                  </motion.div>
                ))}
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
                className="mt-10 flex items-center justify-center gap-2"
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
          </div>
        </LandingSection>
      </main>
      <LandingFooter />
    </LandingLayout>
  )
}
