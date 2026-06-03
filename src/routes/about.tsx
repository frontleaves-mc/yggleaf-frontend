import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  FileText,
  Globe,
  Heart,
  Palette,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { LandingLayout } from '#/components/landing/landing-layout'
import { LandingNavbar } from '#/components/landing/landing-navbar'
import { LandingFooter } from '#/components/landing/landing-footer'
import { LandingCard } from '#/components/landing/landing-primitives'
import { LandingSection } from '#/components/landing/landing-section'
import {
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from '#/components/landing/landing-animate'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

const SERVER_ADDRESS = 'mc.frontleaves.com'
const QQ_GROUP = '805030578'

const VALUES = [
  {
    icon: Heart,
    title: '长期',
    description: '服务器内容、规则和工具围绕长期运营设计，避免短期热闹后失控。',
  },
  {
    icon: Users,
    title: '协作',
    description: '鼓励玩家建设、交易、探索和反馈，让社区秩序能被持续维护。',
  },
  {
    icon: Sparkles,
    title: '克制',
    description: '模组和系统功能服务于体验本身，不用复杂度覆盖基础可玩性。',
  },
] as const

const PLATFORM_FEATURES = [
  {
    icon: ShieldCheck,
    title: '统一认证',
    description: 'SSO 连接玩家中心、初始化流程和管理员后台，账号状态更清晰。',
  },
  {
    icon: Palette,
    title: '外观资源',
    description: '皮肤、披风和游戏档案集中管理，网页端可预览、上传和切换。',
  },
  {
    icon: FileText,
    title: '公告工单',
    description: '公告负责同步重要信息，工单负责把问题反馈变成可追踪记录。',
  },
  {
    icon: Globe,
    title: '游戏联动',
    description:
      '网页工具和服务器状态结合，减少玩家在群聊、网页、游戏间反复找入口。',
  },
] as const

function AboutPage() {
  return (
    <LandingLayout>
      <LandingNavbar />

      <main>
        <section className="relative overflow-hidden border-b border-border bg-background">
          <div className="absolute inset-0 bg-noise opacity-60" />
          <div className="absolute inset-0 mc-grid-pattern opacity-25" />
          <div className="relative mx-auto grid min-h-[520px] max-w-(--page-max) items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)] lg:px-8">
            <FadeInUp className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-none border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground mc-pixel-shadow-sm">
                <ShieldCheck className="size-3.5 text-primary" />
                FrontLeaves Minecraft Community
              </div>
              <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                关于锋楪游戏
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                锋楪是 FrontLeaves 维护的 Minecraft
                模组服务器社区。我们希望官网不只是展示页，而是玩家加入、管理账号、同步公告和反馈问题的稳定入口。
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
                  <Link to="/rules">查看社区规则</Link>
                </Button>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.08}>
              <LandingCard className="p-5">
                <div className="grid gap-3">
                  <InfoRow label="服务器地址" value={SERVER_ADDRESS} />
                  <InfoRow label="游戏版本" value="Java Edition 1.21.1" />
                  <InfoRow label="社区群组" value={`QQ ${QQ_GROUP}`} />
                  <InfoRow label="站点能力" value="账号 / 外观 / 公告 / 工单" />
                </div>
              </LandingCard>
            </FadeInUp>
          </div>
        </section>

        <LandingSection
          title="我们在意什么"
          subtitle="先把基础体验做好，再扩展更复杂的系统。"
        >
          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {VALUES.map((value) => (
              <StaggerItem key={value.title}>
                <LandingCard className="h-full p-5">
                  <div className="mb-4 flex size-10 items-center justify-center rounded-none bg-muted text-primary">
                    <value.icon className="size-5" />
                  </div>
                  <h3 className="font-heading text-base font-semibold tracking-tight">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {value.description}
                  </p>
                </LandingCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </LandingSection>

        <LandingSection
          title="官网承担的工作"
          subtitle="这些不是装饰，而是玩家和管理组每天会用到的入口。"
          className="pt-0"
        >
          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {PLATFORM_FEATURES.map((feature) => (
              <StaggerItem key={feature.title}>
                <LandingCard className="flex h-full gap-4 p-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-none bg-muted text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-semibold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </LandingCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </LandingSection>

        <section className="border-y border-border bg-[oklch(0.17_0.018_238)] py-16 text-white">
          <div className="mx-auto flex max-w-(--page-max) flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                加入前先看规则，加入后进入玩家中心
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                服务器地址 {SERVER_ADDRESS}，白名单申请请前往 QQ 群 {QQ_GROUP}。
              </p>
            </div>
            <Button
              size="lg"
              asChild
              className="h-11 bg-white text-[oklch(0.17_0.018_238)] hover:bg-white/90"
            >
              <Link to="/announcements">查看最新公告</Link>
            </Button>
          </div>
        </section>
      </main>

      <LandingFooter />
    </LandingLayout>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mc-slot flex items-center justify-between gap-4 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  )
}
