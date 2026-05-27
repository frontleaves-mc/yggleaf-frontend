import { createFileRoute, Link } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  FileText,
  Gamepad,
  Handshake,
  Lock,
  MessageSquare,
  MessageSquareWarning,
  Scale,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '#/components/ui/button'
import { LandingLayout } from '#/components/landing/landing-layout'
import { LandingNavbar } from '#/components/landing/landing-navbar'
import { LandingFooter } from '#/components/landing/landing-footer'
import { LandingCard } from '#/components/landing/landing-primitives'
import { LandingSection } from '#/components/landing/landing-section'
import { FadeInUp } from '#/components/landing/landing-animate'
import { MarkdownRenderer } from '#/components/ui/markdown-renderer'
import rulesMd from '#/content/community-rules.md?raw'
import {
  floatSlowVariants,
  scrollRevealContainer,
  scrollRevealItem,
} from '#/lib/motion-presets'

export const Route = createFileRoute('/rules')({
  component: RulesPage,
})

const SERVER_ADDRESS = 'mc.frontleaves.com'

const RULES_SECTIONS = [
  { id: '一基本行为准则', label: '基本行为', icon: ShieldCheck },
  { id: '二游戏内规则', label: '游戏规则', icon: Gamepad },
  { id: '三聊天与社交', label: '聊天社交', icon: MessageSquare },
  { id: '四账号与安全', label: '账号安全', icon: Lock },
  { id: '五管理团队', label: '管理团队', icon: Users },
  { id: '六违规处罚', label: '违规处罚', icon: AlertTriangle },
  { id: '七附则', label: '附则', icon: FileText },
] as const

function RulesPage() {
  return (
    <LandingLayout>
      <LandingNavbar />
      <main className="scroll-smooth">
        <section className="relative overflow-hidden border-b border-border bg-background">
          <div className="absolute inset-0 bg-noise opacity-60" />
          <div className="absolute inset-0 mc-grid-pattern opacity-25" />

          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-40"
            style={{
              background:
                'radial-gradient(circle at center, oklch(0.53 0.12 130 / 35%) 0%, oklch(0.53 0.12 130 / 10%) 45%, transparent 70%)',
            }}
          />
          <div
            className="pointer-events-none absolute -top-20 right-0 h-[350px] w-[400px] rounded-full opacity-30"
            style={{
              background:
                'radial-gradient(circle at 60% 50%, oklch(0.65 0.14 146 / 25%) 0%, transparent 60%)',
            }}
          />

          <div className="relative mx-auto grid max-w-(--page-max) gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.65fr)] lg:px-8">
            <FadeInUp>
              <div className="mb-5 inline-flex items-center gap-2.5 rounded-full bg-background/80 px-4 py-1.5 shadow-sm backdrop-blur-sm ring-1 ring-border/60">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/40 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                <ShieldCheck className="size-3.5 text-primary" />
                <span className="text-xs font-medium tracking-wide text-muted-foreground">
                  加入前请先阅读
                </span>
                <span className="ml-1 h-3 w-px rounded-full bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
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

              <motion.div
                variants={floatSlowVariants}
                initial="animate"
                className="mt-10 flex items-center gap-2"
              >
                <span className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-border" />
                <span className="flex gap-1.5">
                  {['dot-a', 'dot-b', 'dot-c', 'dot-d'].map((id, i) => (
                    <span
                      key={id}
                      className="size-1.5 rounded-full bg-primary/30"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </span>
                <span className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-border" />
              </motion.div>
            </FadeInUp>

            <FadeInUp delay={0.08}>
              <LandingCard
                accent="grass"
                className="group/card overflow-hidden p-0"
              >
                <div className="p-5 pb-4">
                  <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-mc-grass/10 text-mc-grass transition-colors duration-300 group-hover/card:bg-mc-grass/15">
                    <MessageSquareWarning className="size-5" />
                  </div>
                  <h2 className="font-heading text-base font-semibold tracking-tight">
                    执行方式
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    管理组会结合日志、截图、上下文和当事人说明处理问题。
                  </p>
                </div>

                <div className="border-t border-border/50 bg-muted/20 px-5 py-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background/80 text-muted-foreground shadow-sm ring-1 ring-border/40">
                        <Scale className="size-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground/90">
                          公正裁决
                        </p>
                        <p className="text-xs leading-5 text-muted-foreground">
                          结合日志与多方说明综合判断
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background/80 text-muted-foreground shadow-sm ring-1 ring-border/40">
                        <ClipboardList className="size-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground/90">
                          工单申诉
                        </p>
                        <p className="text-xs leading-5 text-muted-foreground">
                          对处罚有异议可通过工单系统提交
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background/80 text-muted-foreground shadow-sm ring-1 ring-border/40">
                        <Handshake className="size-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground/90">
                          理性沟通
                        </p>
                        <p className="text-xs leading-5 text-muted-foreground">
                          遇到争议请通过官方渠道反馈
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </LandingCard>
            </FadeInUp>
          </div>
        </section>

        <LandingSection className="relative">
          <div className="pointer-events-none absolute inset-0 mc-grid-pattern opacity-[0.03]" />

          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <LandingCard className="p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    <span className="text-sm font-semibold tracking-tight text-foreground">
                      规则目录
                    </span>
                  </div>
                  <nav className="flex flex-col gap-1">
                    {RULES_SECTIONS.map((section) => {
                      const Icon = section.icon
                      return (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          className="group/link flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted/60 hover:text-foreground"
                        >
                          <Icon className="size-4 shrink-0 transition-colors duration-200 group-hover/link:text-primary" />
                          <span>{section.label}</span>
                        </a>
                      )
                    })}
                  </nav>
                  <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent" />
                  <p className="mt-3 px-2.5 text-xs leading-relaxed text-muted-foreground/60">
                    保持尊重、先沟通、再申诉。规则会随服务器运营情况调整。
                  </p>
                </LandingCard>
              </div>
            </aside>

            <div className="relative">
              <div className="mb-5 lg:hidden">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {RULES_SECTIONS.map((section) => {
                    const Icon = section.icon
                    return (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm shadow-sm transition-colors duration-200 hover:border-primary/30 hover:text-foreground"
                      >
                        <Icon className="size-3" />
                        {section.label}
                      </a>
                    )
                  })}
                </div>
              </div>

              <LandingCard className="relative overflow-visible p-8 sm:p-12">
                <div className="pointer-events-none absolute left-0 top-6 bottom-6 w-[2px] rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent" />

                <MarkdownRenderer
                  content={rulesMd}
                  className="prose prose-sm dark:prose-invert max-w-none
                    [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:font-heading [&_h1]:text-2xl [&_h1]:tracking-tight [&_h1]:pb-2 [&_h1]:border-b [&_h1]:border-border/50 first:[&_h1]:mt-0
                    [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:tracking-tight [&_h2]:pb-1.5 [&_h2]:border-b [&_h2]:border-border/40
                    [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:tracking-tight
                    [&_p]:text-[15px] [&_p]:leading-8 [&_p]:text-muted-foreground
                    [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-2
                    [&_li]:marker:text-muted-foreground
                    [&_strong]:text-foreground
                    [&_hr]:my-8 [&_hr]:border-border/60 [&_hr]:bg-gradient-to-r [&_hr]:from-transparent [&_hr]:via-border/60 [&_hr]:to-transparent
                    [&_blockquote]:rounded-r-lg [&_blockquote]:border-l-2 [&_blockquote]:border-l-primary/30 [&_blockquote]:bg-muted/40 [&_blockquote]:py-1 [&_blockquote]:pl-4
                    [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px]
                    [&_table]:text-sm
                    [&_th]:bg-muted [&_th]:font-semibold [&_th]:text-foreground [&_th]:py-2.5
                    [&_td]:border-border [&_td]:py-2
                    [&_a]:text-primary [&_a]:font-medium [&_a]:no-underline [&_a]:transition-colors hover:[&_a]:underline hover:[&_a]:text-primary/80"
                />
              </LandingCard>

              <motion.div
                variants={scrollRevealContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <motion.div variants={scrollRevealItem}>
                  <Link
                    to="/"
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 transition-colors group-hover:bg-primary/10">
                      <ArrowLeft className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">
                        返回首页
                      </p>
                      <p className="truncate text-sm font-medium text-foreground">
                        回到锋楪首页
                      </p>
                    </div>
                  </Link>
                </motion.div>

                <motion.div variants={scrollRevealItem}>
                  <Link
                    to="/announcements"
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 transition-colors group-hover:bg-primary/10">
                      <ArrowRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">
                        查看公告
                      </p>
                      <p className="truncate text-sm font-medium text-foreground">
                        浏览服务器动态
                      </p>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </LandingSection>
      </main>
      <LandingFooter />
    </LandingLayout>
  )
}
