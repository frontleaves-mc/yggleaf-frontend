import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, CalendarDays, Inbox } from 'lucide-react'
import { motion } from 'motion/react'
import { usePublicAnnouncements } from '#/api/endpoints/api-mc/public-announcement'
import type { AnnouncementListItem } from '#/api/types/api-mc/announcement'
import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import { LandingLayout } from '#/components/landing/landing-layout'
import { LandingNavbar } from '#/components/landing/landing-navbar'
import { LandingFooter } from '#/components/landing/landing-footer'
import { LandingCard } from '#/components/landing/landing-primitives'
import { LandingSection } from '#/components/landing/landing-section'
import { getAnnouncementTypeBadge } from '#/lib/announcement-helpers'
import {
  scrollRevealContainer,
  scrollRevealItem,
  cardHoverVariants,
  arrowSlideVariants,
  floatSlowVariants,
} from '#/lib/motion-presets'

const TYPE_TABS = [
  { label: '全部', value: 'all', type: undefined },
  { label: '站内公告', value: 'site', type: 1 },
  { label: '全局通知', value: 'global', type: 2 },
] as const

export const Route = createFileRoute('/announcements/')({
  component: PublicAnnouncementsPage,
})

function PublicAnnouncementsPage() {
  const [activeTab, setActiveTab] =
    useState<(typeof TYPE_TABS)[number]['value']>('all')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const activeType = TYPE_TABS.find((tab) => tab.value === activeTab)?.type

  const { data, isLoading } = usePublicAnnouncements({
    page,
    page_size: pageSize,
    type: activeType,
  })

  const list = data?.list ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const handleTypeChange = (value: string) => {
    if (!value) return
    setActiveTab(value as (typeof TYPE_TABS)[number]['value'])
    setPage(1)
  }

  return (
    <LandingLayout>
      <LandingNavbar />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-background">
          <div className="absolute inset-0 bg-noise opacity-60" />
          <div className="absolute inset-0 mc-grid-pattern opacity-25" />

          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-none opacity-40"
            style={{
              background:
                'radial-gradient(circle at center, oklch(0.53 0.12 130 / 35%) 0%, oklch(0.53 0.12 130 / 10%) 45%, transparent 70%)',
            }}
          />
          <div
            className="pointer-events-none absolute -top-20 right-0 h-[350px] w-[400px] rounded-none opacity-30"
            style={{
              background:
                'radial-gradient(circle at 60% 50%, oklch(0.65 0.14 146 / 25%) 0%, transparent 60%)',
            }}
          />

          <div className="relative mx-auto max-w-(--page-max) px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <div className="mb-5 inline-flex items-center gap-2.5 rounded-none bg-background/80 px-4 py-1.5 mc-pixel-shadow-sm backdrop-blur-sm ring-1 ring-border/60">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-none bg-primary/40 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-none bg-primary" />
                </span>
                <span className="text-xs font-medium tracking-wide text-muted-foreground">
                  服务器动态与维护通知
                </span>
                <span className="ml-1 h-3 w-px rounded-none bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
              </div>

              <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                公告中心
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                查看锋楪服务器的活动、维护、规则调整和站内功能更新。重要通知会优先在这里沉淀，避免只散落在群聊里。
              </p>

              <motion.div
                variants={floatSlowVariants}
                initial="animate"
                className="mt-8 flex items-center gap-2"
              >
                <span className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-border" />
                <span className="flex gap-1">
                  {['dot-a', 'dot-b', 'dot-c', 'dot-d'].map((id, i) => (
                    <span
                      key={id}
                      className="size-1 rounded-none bg-primary/30"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <LandingSection>
          <div className="mb-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center rounded-none bg-muted/60 p-1 ring-1 ring-inset ring-border/50 backdrop-blur-sm">
                {TYPE_TABS.map((tab) => {
                  const isActive = activeTab === tab.value
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => handleTypeChange(tab.value)}
                      className={`
                        relative inline-flex items-center gap-2 rounded-none px-4 py-2 text-sm font-medium
                        transition-all duration-200 ease-out cursor-pointer
                        ${
                          isActive
                            ? 'bg-background text-foreground mc-pixel-shadow-sm'
                            : 'text-muted-foreground hover:text-foreground/80'
                        }
                      `}
                    >
                      {tab.label}
                      <span
                        className={`inline-flex min-w-[20px] items-center justify-center rounded-none px-1.5 text-xs font-semibold tabular-nums transition-colors duration-200 ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted/80 text-muted-foreground/70'
                        }`}
                      >
                        {tab.value === 'all' ? total : '?'}
                      </span>
                    </button>
                  )
                })}
              </div>

              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span className="inline-block size-1.5 rounded-none bg-primary/50" />
                共{' '}
                <span className="font-medium tabular-nums text-foreground/80">
                  {total}
                </span>{' '}
                条公告
              </p>
            </div>

            <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent" />
          </div>

          {isLoading ? (
            <AnnouncementsSkeleton />
          ) : list.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 gap-4"
              variants={scrollRevealContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              {list.map((item, index) => (
                <motion.div key={item.id} variants={scrollRevealItem}>
                  <AnnouncementRow item={item} index={index} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-none border border-dashed border-border/60 py-20 text-center"
            >
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  background:
                    'radial-gradient(circle at 50% 40%, oklch(0.53 0.12 130 / 6%), transparent 70%)',
                }}
              />
              <div className="absolute inset-0 dot-grid opacity-40" />

              <div className="relative">
                <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-none bg-muted/60 ring-1 ring-inset ring-border/40">
                  <Inbox className="size-7 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  暂无公告
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground/60">
                  当前筛选条件下没有找到任何公告
                </p>
              </div>
            </motion.div>
          )}

          {!isLoading && totalPages > 1 && (
            <div className="mt-12">
              <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent" />

              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-none px-4"
                >
                  上一页
                </Button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const pageNum = i + 1
                    const isActive = page === pageNum

                    if (totalPages > 7) {
                      if (i === 0 || i === 6 || (i >= page - 2 && i <= page)) {
                        return (
                          <button
                            key={`page-${pageNum}`}
                            type="button"
                            onClick={() => setPage(pageNum)}
                            disabled={isActive}
                            className={`
                              flex size-9 items-center justify-center rounded-none text-sm font-medium
                              transition-all duration-200 cursor-pointer
                              ${
                                isActive
                                  ? 'bg-primary text-primary-foreground mc-pixel-shadow shadow-primary/25'
                                  : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105'
                              }
                            `}
                          >
                            {pageNum}
                          </button>
                        )
                      }
                      if (i === 3 || i === 4) {
                        return (
                          <span
                            key="page-ellipsis"
                            className="px-0.5 text-muted-foreground/40"
                          >
                            ···
                          </span>
                        )
                      }
                      return null
                    }

                    return (
                      <button
                        key={`page-${pageNum}`}
                        type="button"
                        onClick={() => setPage(pageNum)}
                        disabled={isActive}
                        className={`
                          flex size-9 items-center justify-center rounded-none text-sm font-medium
                          transition-all duration-200 cursor-pointer
                          ${
                            isActive
                              ? 'bg-primary text-primary-foreground mc-pixel-shadow shadow-primary/25'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105'
                          }
                        `}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-none px-4"
                >
                  下一页
                </Button>
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground/60">
                第 {page} 页，共 {totalPages} 页
              </p>
            </div>
          )}
        </LandingSection>
      </main>
      <LandingFooter />
    </LandingLayout>
  )
}

function AnnouncementRow({
  item,
  index,
}: {
  item: AnnouncementListItem
  index: number
}) {
  const date = item.published_at || item.created_at
  const accentClass =
    item.type === 1
      ? 'bg-mc-grass'
      : item.type === 2
        ? 'bg-mc-diamond'
        : 'bg-mc-grass'

  const displayIndex = String(index + 1).padStart(2, '0')

  return (
    <Link
      to="/announcements/$id"
      params={{ id: item.id }}
      className="block group"
    >
      <motion.div
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
        className="relative overflow-hidden rounded-none border border-border bg-card transition-colors duration-300 landing-glow-hover"
      >
        <div
          className={`absolute top-0 left-0 h-full w-[3px] ${accentClass}`}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'linear-gradient(to right, oklch(from var(--color-mc-grass) l c h / 3%), transparent 60%)',
          }}
        />

        <div className="relative flex gap-5 p-5">
          <div className="flex shrink-0 flex-col items-center pt-0.5">
            <span className="font-heading text-2xl font-bold leading-none text-muted-foreground/15 transition-colors duration-300 group-hover:text-primary/20 tabular-nums">
              {displayIndex}
            </span>
            <span className="mt-1.5 h-4 w-px bg-border/60" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2.5">
              {getAnnouncementTypeBadge(item.type)}
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/80">
                <CalendarDays className="size-3" />
                <time dateTime={date ?? undefined}>
                  {date
                    ? new Date(date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : '未发布'}
                </time>
              </span>
            </div>

            <div className="mb-3 h-px w-12 bg-gradient-to-r from-border/60 to-transparent" />

            <h2 className="line-clamp-1 font-heading text-lg font-semibold tracking-tight transition-all duration-300 group-hover:text-primary">
              {item.title}
            </h2>

            <p className="mt-2 line-clamp-2 text-[15px] leading-7 text-muted-foreground">
              {item.desc || item.content?.slice(0, 120) || '暂无摘要'}
            </p>
          </div>

          <div className="hidden shrink-0 flex-col items-center justify-center sm:flex">
            <motion.span
              variants={arrowSlideVariants}
              initial="rest"
              whileHover="hover"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary/70 transition-colors duration-200 group-hover:text-primary"
            >
              查看详情
              <ArrowRight className="size-4" />
            </motion.span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

function AnnouncementsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {['a', 'b', 'c'].map((key) => (
        <LandingCard key={key} className="relative overflow-hidden p-5">
          <div className="absolute top-0 left-0 h-full w-[3px] bg-muted-foreground/15" />

          <div className="flex gap-5">
            <div className="flex shrink-0 flex-col items-center pt-0.5">
              <Skeleton className="h-7 w-6" />
              <Skeleton className="mt-2 h-4 w-px" />
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-12 rounded-none" />
                <Skeleton className="h-5 w-28 rounded-none" />
              </div>
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/5" />
            </div>

            <div className="hidden shrink-0 items-center sm:flex">
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </LandingCard>
      ))}
    </div>
  )
}
