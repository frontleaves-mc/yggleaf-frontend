import { Link } from '@tanstack/react-router'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { usePublicAnnouncements } from '#/api/endpoints/api-mc/public-announcement'
import {
  StaggerContainer,
  StaggerItem,
} from '#/components/landing/landing-animate'
import { LandingCard } from '#/components/landing/landing-primitives'
import { LandingSection } from '#/components/landing/landing-section'
import { Skeleton } from '#/components/ui/skeleton'
import { getAnnouncementTypeBadge } from '#/lib/announcement-helpers'

function AnnouncementCard({
  announcement,
}: {
  announcement: {
    id: string
    title: string
    desc?: string
    type: number
    created_at: string
  }
}) {
  return (
    <Link to="/announcements/$id" params={{ id: String(announcement.id) }}>
      <LandingCard className="p-6 h-full group/card">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {getAnnouncementTypeBadge(announcement.type)}
          <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {new Date(announcement.created_at).toLocaleDateString('zh-CN')}
          </span>
        </div>

        <h3 className="font-heading font-semibold mb-2 group-hover/card:text-primary transition-colors line-clamp-1">
          {announcement.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {announcement.desc ?? announcement.content?.slice(0, 100) ?? ''}
        </p>
      </LandingCard>
    </Link>
  )
}

function AnnouncementsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LandingCard key="skel-0" className="p-6">
        <Skeleton className="h-5 w-16 mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </LandingCard>
      <LandingCard key="skel-1" className="p-6">
        <Skeleton className="h-5 w-16 mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </LandingCard>
      <LandingCard key="skel-2" className="p-6">
        <Skeleton className="h-5 w-16 mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </LandingCard>
    </div>
  )
}

function AnnouncementsEmpty() {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <p>暂无公告</p>
    </div>
  )
}

function AnnouncementsSection() {
  const { data, isLoading } = usePublicAnnouncements({ page: 1, page_size: 5 })
  const announcements = data?.list ?? []

  return (
    <LandingSection
      id="announcements"
      title="最新公告"
      subtitle="了解服务器最新动态"
    >
      <div className="flex justify-end mb-6">
        <Link
          to="/announcements"
          className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          查看全部
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {isLoading ? (
        <AnnouncementsSkeleton />
      ) : announcements.length === 0 ? (
        <AnnouncementsEmpty />
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((a) => (
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
