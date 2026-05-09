import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  FileText,
  MessageSquareWarning,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { LandingLayout } from '#/components/landing/landing-layout'
import { LandingNavbar } from '#/components/landing/landing-navbar'
import { LandingFooter } from '#/components/landing/landing-footer'
import { LandingCard } from '#/components/landing/landing-primitives'
import { LandingSection } from '#/components/landing/landing-section'
import { FadeInUp } from '#/components/landing/landing-animate'
import { MarkdownRenderer } from '#/components/ui/markdown-renderer'
import rulesMd from '#/content/community-rules.md?raw'

export const Route = createFileRoute('/rules')({
  component: RulesPage,
})

const SERVER_ADDRESS = 'mc.frontleaves.com'

function RulesPage() {
  return (
    <LandingLayout>
      <LandingNavbar />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-background">
          <div className="absolute inset-0 bg-noise opacity-60" />
          <div className="absolute inset-0 mc-grid-pattern opacity-25" />
          <div className="relative mx-auto grid max-w-(--page-max) gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.65fr)] lg:px-8">
            <FadeInUp>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
                <ShieldCheck className="size-3.5 text-primary" />
                加入前请先阅读
              </div>
              <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                社区规则
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                规则用于保护长期生存体验和玩家协作秩序。进入 {SERVER_ADDRESS}{' '}
                前，请先确认白名单、建筑、交易和行为规范。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild className="h-11">
                  <Link
                    to="/login"
                    search={{ callback: '/user/dashboard' } as any}
                  >
                    进入玩家中心
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-11">
                  <Link to="/announcements">查看公告</Link>
                </Button>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.08}>
              <LandingCard className="p-5">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-muted text-primary">
                  <MessageSquareWarning className="size-5" />
                </div>
                <h2 className="font-heading text-base font-semibold tracking-tight">
                  执行方式
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  管理组会结合日志、截图、上下文和当事人说明处理问题。遇到争议请通过工单或群内渠道反馈，不要扩大冲突。
                </p>
              </LandingCard>
            </FadeInUp>
          </div>
        </section>

        <LandingSection>
          <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                <div className="mb-3 flex items-center gap-2 font-medium text-foreground">
                  <FileText className="size-4 text-primary" />
                  规则文档
                </div>
                <p className="leading-6">
                  保持尊重、先沟通、再申诉。规则会随服务器运营情况调整。
                </p>
              </div>
            </aside>

            <LandingCard className="p-6 sm:p-8">
              <MarkdownRenderer
                content={rulesMd}
                className="prose prose-sm dark:prose-invert max-w-none
                  [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:font-heading [&_h1]:text-2xl [&_h1]:tracking-tight first:[&_h1]:mt-0
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
          </div>
        </LandingSection>
      </main>
      <LandingFooter />
    </LandingLayout>
  )
}
