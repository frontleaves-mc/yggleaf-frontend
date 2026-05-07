import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { usePublicAnnouncementDetail } from '#/api/endpoints/api-mc/public-announcement'
import { PublicLayout } from '#/components/public/website/public-layout'
import { MarkdownRenderer } from '#/components/ui/markdown-renderer'
import { getAnnouncementTypeBadge } from '#/lib/announcement-helpers'
import {
  scrollRevealContainer,
  scrollRevealItem,
} from '#/lib/motion-presets'

export const Route = createFileRoute('/announcements/$id')({
  component: PublicAnnouncementDetailPage,
})

function PublicAnnouncementDetailPage() {
  const { id } = Route.useParams()
  const { data, isLoading } = usePublicAnnouncementDetail(id)

  return (
    <PublicLayout>
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-(--page-max) px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <motion.div
              variants={scrollRevealContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <motion.div variants={scrollRevealItem}>
                <Link
                  to="/announcements"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  返回列表
                </Link>
              </motion.div>

              {isLoading ? (
                <motion.div className="mt-8 space-y-4" variants={scrollRevealItem}>
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
                <motion.div className="mt-8 space-y-6" variants={scrollRevealItem}>
                  <div>
                    <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                      {data.title}
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      {getAnnouncementTypeBadge(data.type)}
                      <span>
                        发布于{' '}
                        {data.published_at
                          ? new Date(data.published_at).toLocaleDateString(
                              'zh-CN',
                            )
                          : '未知时间'}
                      </span>
                    </div>
                  </div>

                  <hr className="border-border/60" />

                  <MarkdownRenderer
                    content={data.content ?? ''}
                    className="prose prose-sm dark:prose-invert max-w-none
                      [&_h1]:font-heading [&_h1]:text-2xl [&_h1]:tracking-tight [&_h1]:mt-8 [&_h1]:mb-4
                      [&_h2]:font-heading [&_h2]:text-xl [&_h2]:tracking-tight [&_h2]:mt-6 [&_h2]:mb-3
                      [&_h3]:font-heading [&_h3]:text-lg [&_h3]:tracking-tight [&_h3]:mt-5 [&_h3]:mb-2
                      [&_p]:leading-relaxed [&_p]:text-[15px] [&_p]:text-muted-foreground
                      [&_ul]:space-y-1.5 [&_ol]:space-y-1.5
                      [&_li]:marker:text-muted-foreground
                      [&_strong]:text-foreground
                      [&_hr]:border-border/60 [&_hr]:my-6
                      [&_blockquote]:border-l-primary/30 [&_blockquote]:bg-muted/50 [&_blockquote]:rounded-r-lg
                      [&_code]:bg-muted [&_code]:rounded-md [&_code]:px-1.5 [&_code]:py-0.5
                      [&_table]:text-sm
                      [&_th]:bg-muted [&_th]:font-semibold [&_th]:text-foreground
                      [&_td]:border-border [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline"
                  />
                </motion.div>
              ) : (
                <motion.div
                  className="mt-20 flex flex-col items-center justify-center text-muted-foreground"
                  variants={scrollRevealItem}
                >
                  <p className="text-base">公告不存在</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
