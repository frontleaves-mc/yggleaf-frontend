import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  Heart,
  Sparkles,
  Users,
  UserPlus,
  Palette,
  Globe,
  MessageSquare,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { PublicLayout } from '#/components/public/website/public-layout'
import {
  scrollRevealContainer,
  scrollRevealItem,
} from '#/lib/motion-presets'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

const VALUES = [
  {
    icon: Heart,
    title: '纯粹',
    description:
      '我们追求纯粹的游戏乐趣，拒绝一切破坏体验的行为',
  },
  {
    icon: Sparkles,
    title: '有趣',
    description:
      '精心挑选的模组和玩法，让每一次登录都有新的发现',
  },
  {
    icon: Users,
    title: '包容',
    description:
      '无论你是建筑大师还是红石新手，都能在锋楪找到自己的位置',
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
    <PublicLayout>
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-(--page-max) px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-16 max-w-3xl"
            variants={scrollRevealContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.h1
              className="text-4xl font-heading font-bold tracking-tight lg:text-5xl"
              variants={scrollRevealItem}
            >
              关于<span className="gradient-text">锋楪</span>
            </motion.h1>
            <motion.p
              className="mt-4 text-lg leading-relaxed text-muted-foreground"
              variants={scrollRevealItem}
            >
              我们致力于打造一个纯粹、有趣的游戏社区
            </motion.p>
          </motion.div>

          <motion.div
            className="mb-20 max-w-3xl"
            variants={scrollRevealContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div
              className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm lg:p-10"
              variants={scrollRevealItem}
            >
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
            </motion.div>
          </motion.div>

          <motion.div
            className="mb-20"
            variants={scrollRevealContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.h2
              className="mb-12 text-center text-3xl font-heading font-bold tracking-tight lg:text-4xl"
              variants={scrollRevealItem}
            >
              我们的<span className="gradient-text">价值观</span>
            </motion.h2>

            <div className="grid gap-6 md:grid-cols-3">
              {VALUES.map((value) => (
                <motion.div
                  key={value.title}
                  className="rounded-2xl border border-border/50 bg-card p-8 text-center shadow-sm"
                  variants={scrollRevealItem}
                >
                  <div className="mx-auto mb-5 inline-flex rounded-xl bg-primary/10 p-3.5">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="mb-20"
            variants={scrollRevealContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.h2
              className="mb-12 text-center text-3xl font-heading font-bold tracking-tight lg:text-4xl"
              variants={scrollRevealItem}
            >
              平台<span className="gradient-text">功能</span>
            </motion.h2>

            <div className="mx-auto grid max-w-2xl gap-4">
              {PLATFORM_FEATURES.map((feature) => (
                <motion.div
                  key={feature.text}
                  className="flex items-start gap-4 rounded-xl border border-border/50 bg-card p-5 shadow-sm"
                  variants={scrollRevealItem}
                >
                  <div className="shrink-0 rounded-lg bg-accent p-2.5">
                    <feature.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="pt-0.5 text-[15px] leading-relaxed text-foreground">
                    {feature.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="section-glow relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-16 text-center"
            variants={scrollRevealContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.h2
              className="mb-3 text-2xl font-heading font-bold tracking-tight lg:text-3xl"
              variants={scrollRevealItem}
            >
              加入我们
            </motion.h2>
            <motion.p
              className="mb-6 text-base text-muted-foreground"
              variants={scrollRevealItem}
            >
              加入 QQ 群 {QQ_GROUP} 开始你的旅程
            </motion.p>
            <motion.div variants={scrollRevealItem}>
              <Button size="lg" asChild>
                <Link to="/">了解更多</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  )
}
