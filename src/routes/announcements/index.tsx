import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, CalendarDays, Megaphone } from 'lucide-react'
import { motion } from 'motion/react'
import { usePublicAnnouncements } from '#/api/endpoints/api-mc/public-announcement'
import type { AnnouncementListItem } from '#/api/types/api-mc/announcement'
import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import { LandingLayout } from '#/components/landing/landing-layout'
import { LandingNavbar } from '#/components/landing/landing-navbar'
import { LandingFooter } from '#/components/landing/landing-footer'
import { LandingCard } from '#/components/landing/landing-primitives'
import { LandingSection } from '#/components/landing/landing-section'
import { getAnnouncementTypeBadge } from '#/lib/announcement-helpers'
import { scrollRevealContainer, scrollRevealItem } from '#/lib/motion-presets'

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
          <div className="relative mx-auto max-w-(--page-max) px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
                <Megaphone className="size-3.5 text-primary" />
                服务器动态与维护通知
              </div>
              <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                公告中心
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                查看锋楪服务器的活动、维护、规则调整和站内功能更新。重要通知会优先在这里沉淀，避免只散落在群聊里。
              </p>
            </motion.div>
          </div>
        </section>

        <LandingSection>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <ToggleGroup
              type="single"
              value={activeTab}
              onValueChange={handleTypeChange}
              variant="outline"
              size="sm"
            >
              {TYPE_TABS.map((tab) => (
                <ToggleGroupItem key={tab.value} value={tab.value}>
                  {tab.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <p className="text-sm text-muted-foreground">共 {total} 条公告</p>
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
              {list.map((item) => (
                <motion.div key={item.id} variants={scrollRevealItem}>
                  <AnnouncementRow item={item} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 py-16 text-center">
              <Megaphone className="mx-auto mb-3 size-5 text-primary" />
              <p className="text-sm text-muted-foreground">暂无公告</p>
            </div>
          )}

          {!isLoading && totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
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
            </div>
          )}
        </LandingSection>
      </main>
      <LandingFooter />
    </LandingLayout>
  )
}

function AnnouncementRow({ item }: { item: AnnouncementListItem }) {
  const date = item.published_at || item.created_at

  return (
    <Link to="/announcements/$id" params={{ id: item.id }} className="block">
      <LandingCard className="group/card p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {getAnnouncementTypeBadge(item.type)}
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="size-3" />
                {date ? new Date(date).toLocaleDateString('zh-CN') : '未发布'}
              </span>
            </div>
            <h2 className="line-clamp-1 font-heading text-lg font-semibold tracking-tight transition-colors group-hover/card:text-primary">
              {item.title}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {item.desc || item.content?.slice(0, 120) || '暂无摘要'}
            </p>
          </div>
          <div className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
            查看详情
            <ArrowRight className="size-4" />
          </div>
        </div>
      </LandingCard>
    </Link>
  )
}

function AnnouncementsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {['a', 'b', 'c'].map((key) => (
        <LandingCard key={key} className="p-5">
          <div className="mb-4 flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="mb-3 h-6 w-2/3" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </LandingCard>
      ))}
    </div>
  )
}
