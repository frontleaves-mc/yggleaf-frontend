import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock,
  Home,
  Megaphone,
  ArrowUp,
} from 'lucide-react'
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from 'motion/react'
import { useState, useCallback } from 'react'
import { usePublicAnnouncementDetail } from '#/api/endpoints/api-mc/public-announcement'
import { Skeleton } from '#/components/ui/skeleton'
import { LandingLayout } from '#/components/landing/landing-layout'
import { LandingNavbar } from '#/components/landing/landing-navbar'
import { LandingFooter } from '#/components/landing/landing-footer'
import { LandingCard } from '#/components/landing/landing-primitives'
import { LandingSection } from '#/components/landing/landing-section'
import { MarkdownRenderer } from '#/components/ui/markdown-renderer'
import { getAnnouncementTypeBadge } from '#/lib/announcement-helpers'
import {
  scrollRevealContainer,
  scrollRevealItem,
  arrowSlideVariants,
} from '#/lib/motion-presets'

export const Route = createFileRoute('/announcements/$id')({
  component: PublicAnnouncementDetailPage,
})

/** ~300 Chinese chars/min reading speed */
function estimateReadingTime(content: string): number {
  const charCount = content.replace(/\s/g, '').length
  return Math.max(1, Math.ceil(charCount / 300))
}

function BackToTop() {
  const [visible, setVisible] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > 400)
  })

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex size-11 items-center justify-center rounded-none border border-border bg-background/90 text-foreground shadow-lg backdrop-blur-sm transition-colors hover:bg-muted/80 hover:text-primary"
          aria-label="回到顶部"
        >
          <ArrowUp className="size-4" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function PublicAnnouncementDetailPage() {
  const { id } = Route.useParams()
  const { data, isLoading } = usePublicAnnouncementDetail(id)

  return (
    <LandingLayout>
      <LandingNavbar />
      <main className="scroll-smooth">
        <section className="relative overflow-hidden border-b border-border bg-background">
          <div className="absolute inset-0 bg-noise opacity-40" />
          <div className="absolute inset-0 mc-grid-pattern opacity-15" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[600px] -translate-x-1/2 rounded-none bg-primary/[0.04] blur-3xl" />

          <div className="relative mx-auto max-w-(--page-max) px-4 py-14 sm:px-6 lg:py-20 lg:px-8">
            <motion.div
              variants={scrollRevealItem}
              initial="hidden"
              animate="visible"
            >
              <Link
                to="/announcements"
                className="-ml-2 inline-flex items-center gap-2 rounded-none px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              >
                <motion.span
                  variants={arrowSlideVariants}
                  initial="rest"
                  whileHover="hover"
                >
                  <ArrowLeft data-icon="inline-start" className="size-4" />
                </motion.span>
                返回公告中心
              </Link>
            </motion.div>

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
                  <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground/70">
                    <Link
                      to="/"
                      className="transition-colors hover:text-foreground"
                    >
                      <Home className="size-3.5" />
                    </Link>
                    <ChevronRight className="size-3" />
                    <Link
                      to="/announcements"
                      className="transition-colors hover:text-foreground"
                    >
                      公告中心
                    </Link>
                    <ChevronRight className="size-3" />
                    <span className="truncate max-w-[200px] text-foreground/60">
                      {data.title}
                    </span>
                  </nav>

                  <div className="mb-5 inline-flex items-center gap-2.5 rounded-none border border-border bg-background/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground mc-pixel-shadow-sm backdrop-blur-sm">
                    <span className="h-2 w-0.5 rounded-none bg-primary" />
                    <Megaphone className="size-3.5 text-primary" />
                    公告详情
                  </div>

                  <div className="relative">
                    <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                      {data.title}
                    </h1>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {getAnnouncementTypeBadge(data.type)}
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-4 text-muted-foreground/60" />
                      发布于{' '}
                      {data.published_at
                        ? new Date(data.published_at).toLocaleDateString(
                            'zh-CN',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            },
                          )
                        : '未知时间'}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-4 text-muted-foreground/60" />约{' '}
                      {estimateReadingTime(data.content)} 分钟阅读
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  variants={scrollRevealItem}
                  className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"
                />
              </motion.div>
            ) : (
              <EmptyState />
            )}
          </div>
        </section>

        {data !== undefined && (
          <LandingSection className="relative">
            <div className="pointer-events-none absolute inset-0 mc-grid-pattern opacity-[0.03]" />

            <motion.div
              className="mx-auto max-w-4xl"
              variants={scrollRevealContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <LandingCard className="relative overflow-visible p-8 sm:p-12">
                <div className="pointer-events-none absolute left-0 top-6 bottom-6 w-[2px] rounded-none bg-gradient-to-b from-primary via-primary/60 to-transparent" />

                <MarkdownRenderer
                  content={data.content}
                  className="prose prose-sm dark:prose-invert max-w-none
                    [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:font-heading [&_h1]:text-2xl [&_h1]:tracking-tight [&_h1]:pb-2 [&_h1]:border-b [&_h1]:border-border/50
                    [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:tracking-tight [&_h2]:pb-1.5 [&_h2]:border-b [&_h2]:border-border/40
                    [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:tracking-tight
                    [&_p]:text-[15px] [&_p]:leading-8 [&_p]:text-muted-foreground
                    [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-2
                    [&_li]:marker:text-muted-foreground
                    [&_strong]:text-foreground
                    [&_hr]:my-8 [&_hr]:border-border/60 [&_hr]:bg-gradient-to-r [&_hr]:from-transparent [&_hr]:via-border/60 [&_hr]:to-transparent
                    [&_blockquote]:rounded-r-lg [&_blockquote]:border-l-2 [&_blockquote]:border-l-primary/30 [&_blockquote]:bg-muted/40 [&_blockquote]:py-1 [&_blockquote]:pl-4
                    [&_code]:rounded-none [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px]
                    [&_table]:text-sm
                    [&_th]:bg-muted [&_th]:font-semibold [&_th]:text-foreground [&_th]:py-2.5
                    [&_td]:border-border [&_td]:py-2
                    [&_a]:text-primary [&_a]:font-medium [&_a]:no-underline [&_a]:transition-colors hover:[&_a]:underline hover:[&_a]:text-primary/80"
                />
              </LandingCard>

              <motion.div
                variants={scrollRevealItem}
                className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <Link
                  to="/announcements"
                  className="group flex items-center gap-3 rounded-none border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:[box-shadow:4px_4px_0_var(--pixel-shadow-color)] hover:shadow-primary/5"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-none bg-muted/60 transition-colors group-hover:bg-primary/10">
                    <ArrowLeft className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">
                      返回列表
                    </p>
                    <p className="truncate text-sm font-medium text-foreground">
                      浏览全部公告
                    </p>
                  </div>
                </Link>
                <div className="hidden sm:block" />
              </motion.div>
            </motion.div>
          </LandingSection>
        )}
      </main>
      <LandingFooter />
      <BackToTop />
    </LandingLayout>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-md py-20 text-center"
    >
      <div className="relative mx-auto mb-6 flex size-20 items-center justify-center">
        <div className="absolute inset-0 rounded-none bg-primary/[0.06]" />
        <div className="absolute inset-2 rounded-none bg-primary/[0.04] animate-pulse" />
        <Megaphone className="relative size-8 text-primary/60" />
      </div>
      <h2 className="mb-2 font-heading text-xl font-semibold tracking-tight text-foreground">
        公告不存在
      </h2>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        该公告可能已被删除或链接有误，请检查后重试。
      </p>
      <Link
        to="/announcements"
        className="group inline-flex items-center gap-2 rounded-none border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground mc-pixel-shadow-sm transition-all duration-200 hover:border-primary/30 hover:[box-shadow:4px_4px_0_var(--pixel-shadow-color)]"
      >
        返回公告中心
        <motion.span
          variants={arrowSlideVariants}
          initial="rest"
          whileHover="hover"
        >
          <ArrowRight className="size-4" />
        </motion.span>
      </Link>
    </motion.div>
  )
}

function AnnouncementDetailSkeleton() {
  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center gap-2">
        <Skeleton className="size-3.5" />
        <Skeleton className="h-3 w-4" />
        <Skeleton className="size-3" />
        <Skeleton className="h-3 w-14" />
        <Skeleton className="size-3" />
        <Skeleton className="h-3 w-32" />
      </div>

      <Skeleton className="h-7 w-28 rounded-none" />
      <div className="space-y-2.5">
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="h-10 w-2/3" />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Skeleton className="h-6 w-14 rounded-none" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-28" />
      </div>

      <Skeleton className="mt-8 h-px w-full" />
    </div>
  )
}
