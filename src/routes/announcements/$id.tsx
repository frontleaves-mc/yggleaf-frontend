import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, CalendarDays, Megaphone } from 'lucide-react'
import { motion } from 'motion/react'
import { usePublicAnnouncementDetail } from '#/api/endpoints/api-mc/public-announcement'
import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import { LandingLayout } from '#/components/landing/landing-layout'
import { LandingNavbar } from '#/components/landing/landing-navbar'
import { LandingFooter } from '#/components/landing/landing-footer'
import { LandingCard } from '#/components/landing/landing-primitives'
import { LandingSection } from '#/components/landing/landing-section'
import { MarkdownRenderer } from '#/components/ui/markdown-renderer'
import { getAnnouncementTypeBadge } from '#/lib/announcement-helpers'
import { scrollRevealContainer, scrollRevealItem } from '#/lib/motion-presets'

export const Route = createFileRoute('/announcements/$id')({
  component: PublicAnnouncementDetailPage,
})

function PublicAnnouncementDetailPage() {
  const { id } = Route.useParams()
  const { data, isLoading } = usePublicAnnouncementDetail(id)

  return (
    <LandingLayout>
      <LandingNavbar />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-background">
          <div className="absolute inset-0 bg-noise opacity-60" />
          <div className="absolute inset-0 mc-grid-pattern opacity-25" />
          <div className="relative mx-auto max-w-(--page-max) px-4 py-16 sm:px-6 lg:px-8">
            <Button variant="ghost" size="sm" asChild className="-ml-2 mb-8">
              <Link to="/announcements">
                <ArrowLeft data-icon="inline-start" />
                返回公告中心
              </Link>
            </Button>

            {isLoading ? (
              <AnnouncementDetailSkeleton />
            ) : data ? (
              <motion.div
                className="max-w-4xl"
                variants={scrollRevealContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={scrollRevealItem}>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
                    <Megaphone className="size-3.5 text-primary" />
                    公告详情
                  </div>
                  <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                    {data.title}
                  </h1>
                  <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {getAnnouncementTypeBadge(data.type)}
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-4" />
                      发布于{' '}
                      {data.published_at
                        ? new Date(data.published_at).toLocaleDateString(
                            'zh-CN',
                          )
                        : '未知时间'}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 py-16 text-center">
                <Megaphone className="mx-auto mb-3 size-5 text-primary" />
                <p className="text-sm text-muted-foreground">公告不存在</p>
              </div>
            )}
          </div>
        </section>

        {data !== undefined && (
          <LandingSection>
            <LandingCard className="mx-auto max-w-4xl p-6 sm:p-8">
              <MarkdownRenderer
                content={data.content}
                className="prose prose-sm dark:prose-invert max-w-none
                  [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:font-heading [&_h1]:text-2xl [&_h1]:tracking-tight
                  [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:tracking-tight
                  [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:tracking-tight
                  [&_p]:text-[15px] [&_p]:leading-7 [&_p]:text-muted-foreground
                  [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-1.5
                  [&_li]:marker:text-muted-foreground
                  [&_strong]:text-foreground
                  [&_hr]:my-6 [&_hr]:border-border
                  [&_blockquote]:rounded-r-lg [&_blockquote]:border-l-primary/40 [&_blockquote]:bg-muted/50
                  [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5
                  [&_table]:text-sm
                  [&_th]:bg-muted [&_th]:font-semibold [&_th]:text-foreground
                  [&_td]:border-border [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline"
              />
            </LandingCard>
          </LandingSection>
        )}
      </main>
      <LandingFooter />
    </LandingLayout>
  )
}

function AnnouncementDetailSkeleton() {
  return (
    <div className="max-w-4xl">
      <Skeleton className="mb-5 h-6 w-28" />
      <Skeleton className="mb-4 h-10 w-4/5" />
      <Skeleton className="h-5 w-52" />
    </div>
  )
}
