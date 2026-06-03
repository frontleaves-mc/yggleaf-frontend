import { Link } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, Megaphone } from 'lucide-react'
import { usePublicAnnouncements } from '#/api/endpoints/api-mc/public-announcement'
import type { AnnouncementListItem } from '#/api/types/api-mc/announcement'
import {
  StaggerContainer,
  StaggerItem,
} from '#/components/landing/landing-animate'
import { LandingCard } from '#/components/landing/landing-primitives'
import { LandingSection } from '#/components/landing/landing-section'
import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import { getAnnouncementTypeBadge } from '#/lib/announcement-helpers'

function AnnouncementCard({
  announcement,
}: {
  announcement: AnnouncementListItem
}) {
  return (
    <Link
      to="/announcements/$id"
      params={{ id: String(announcement.id) }}
      className="block h-full"
    >
      <LandingCard className="group/card flex h-full cursor-pointer flex-col p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {getAnnouncementTypeBadge(announcement.type)}
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="size-3" />
            {new Date(announcement.created_at).toLocaleDateString('zh-CN')}
          </span>
        </div>

        <h3 className="line-clamp-2 font-pixel font-heading text-base font-semibold tracking-tight transition-colors group-hover/card:text-primary">
          {announcement.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {announcement.desc || announcement.content?.slice(0, 100) || ''}
        </p>
        <div
          className="mt-auto pt-5 text-xs font-medium text-primary"
          aria-hidden="true"
        >
          阅读公告
        </div>
      </LandingCard>
    </Link>
  )
}

function AnnouncementsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <LandingCard key="skel-0" className="p-5">
        <Skeleton className="mb-4 h-5 w-16" />
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </LandingCard>
      <LandingCard key="skel-1" className="p-5">
        <Skeleton className="mb-4 h-5 w-16" />
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </LandingCard>
      <LandingCard key="skel-2" className="p-5">
        <Skeleton className="mb-4 h-5 w-16" />
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </LandingCard>
    </div>
  )
}

function AnnouncementsEmpty() {
  return (
    <div className="rounded-none border border-dashed border-border bg-muted/30 py-12 text-center text-muted-foreground">
      <Megaphone className="mx-auto mb-3 size-5 text-primary" />
      <p className="text-sm">暂无公告</p>
    </div>
  )
}

function AnnouncementsSection() {
  const { data, isLoading } = usePublicAnnouncements({ page: 1, page_size: 5 })
  const announcements = data?.list ?? []

  return (
    <LandingSection
      id="announcements"
      title="最新动态"
      subtitle="维护、活动和规则更新都从这里开始。"
      variant="default"
    >
      <div className="mb-6 flex justify-end">
        <Button variant="outline" size="sm" asChild>
          <Link to="/announcements">
            查看全部
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <AnnouncementsSkeleton />
      ) : announcements.length === 0 ? (
        <AnnouncementsEmpty />
      ) : (
        <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {announcements.slice(0, 3).map((a) => (
            <StaggerItem key={a.id}>
              <AnnouncementCard announcement={a} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </LandingSection>
  )
}

export { AnnouncementsSection }
