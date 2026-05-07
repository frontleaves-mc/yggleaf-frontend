import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Heart,
  Sparkles,
  Users,
  UserPlus,
  Palette,
  Globe,
  MessageSquare,
} from 'lucide-react'
import { LandingLayout } from '#/components/landing/landing-layout'
import { LandingNavbar } from '#/components/landing/landing-navbar'
import { LandingFooter } from '#/components/landing/landing-footer'
import { LandingSection } from '#/components/landing/landing-section'
import { LandingCard, LandingButton  } from '#/components/landing/landing-primitives'
import { FadeInUp,
  StaggerContainer,
  StaggerItem } from '#/components/landing/landing-animate'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

const VALUES = [
  {
    icon: Heart,
    title: '纯粹',
    description: '我们追求纯粹的游戏乐趣，拒绝一切破坏体验的行为',
  },
  {
    icon: Sparkles,
    title: '有趣',
    description: '精心挑选的模组和玩法，让每一次登录都有新的发现',
  },
  {
    icon: Users,
    title: '包容',
    description: '无论你是建筑大师还是红石新手，都能在锋楪找到自己的位置',
  },
]

const PLATFORM_FEATURES = [
  { icon: UserPlus, text: '创建游戏档案 — 绑定你的 Minecraft 游戏身份' },
  { icon: Palette, text: '管理皮肤与披风 — 上传、更换角色外观资源' },
  { icon: Globe, text: '网页端联动 — 在网页上管理游戏内数据' },
  { icon: MessageSquare, text: '社区互动 — 参与服务器事务与社区建设' },
]

const QQ_GROUP = '805030578'

function AboutPage() {
  return (
    <LandingLayout>
      <LandingNavbar />

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-(--page-max) px-4 sm:px-6 lg:px-8">
          <FadeInUp className="mb-16 max-w-3xl">
            <h1 className="text-4xl font-heading font-bold tracking-tight lg:text-5xl">
              关于<span className="mc-gradient-text">锋楪</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              我们致力于打造一个纯粹、有趣的游戏社区
            </p>
          </FadeInUp>

          <FadeInUp delay={0.1} className="mb-20 max-w-3xl">
            <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm lg:p-10">
              <p className="leading-relaxed text-[15px] text-muted-foreground">
                锋楪（Yggleaf）是一个基于 Minecraft 1.21.1 的模组服务器社区。
                我们专注于为玩家提供稳定、有趣且富有创造力的游戏环境。
                通过精心挑选和配置的模组组合，我们打造了一个既保留原版乐趣，
                又充满新鲜体验的世界。无论你是热衷于建筑、探索、科技还是魔法，
                都能在锋楪找到属于你的冒险。
              </p>
              <p className="mt-4 leading-relaxed text-[15px] text-muted-foreground">
                作为 Yggleaf 平台的一部分，锋楪提供完整的网页端联动体验——
                从账号绑定、皮肤管理到社区互动，一切尽在掌握之中。
                加入我们，与志同道合的伙伴一起书写属于你的方块故事。
              </p>
            </div>
          </FadeInUp>

          <LandingSection
            title="我们的价值观"
            subtitle="我们相信什么，就坚持什么"
          >
            <StaggerContainer className="grid gap-6 md:grid-cols-3">
              {VALUES.map((value) => (
                <StaggerItem key={value.title}>
                  <LandingCard accent="grass" className="p-8 text-center">
                    <div className="mx-auto mb-5 inline-flex rounded-xl bg-mc-grass/15 p-3.5">
                      <value.icon className="h-7 w-7 text-mc-grass" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </LandingCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </LandingSection>

          <LandingSection
            title="平台功能"
            subtitle="一站式管理你的 Minecraft 游戏身份"
          >
            <StaggerContainer className="mx-auto grid max-w-2xl gap-4">
              {PLATFORM_FEATURES.map((feature) => (
                <StaggerItem key={feature.text}>
                  <LandingCard
                    accent="diamond"
                    className="flex items-start gap-4 p-5"
                  >
                    <div className="shrink-0 rounded-lg bg-mc-diamond/15 p-2.5">
                      <feature.icon className="h-5 w-5 text-mc-diamond" />
                    </div>
                    <p className="pt-0.5 text-[15px] leading-relaxed text-foreground">
                      {feature.text}
                    </p>
                  </LandingCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </LandingSection>

          <LandingSection>
            <FadeInUp className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-mc-grass/10 via-mc-diamond/5 to-mc-nether/10 py-16 text-center">
              <h2 className="mb-3 text-2xl font-heading font-bold tracking-tight lg:text-3xl">
                加入我们
              </h2>
              <p className="mb-6 text-base text-muted-foreground">
                加入 QQ 群 {QQ_GROUP} 开始你的旅程
              </p>
              <LandingButton size="lg" asChild>
                <Link to="/">了解更多</Link>
              </LandingButton>
            </FadeInUp>
          </LandingSection>
        </div>
      </section>

      <LandingFooter />
    </LandingLayout>
  )
}
