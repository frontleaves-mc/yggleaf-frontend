import { createFileRoute, Link } from '@tanstack/react-router'
import * as React from 'react'
import { motion } from 'motion/react'
import {
  Users,
  Globe,
  Palette,
  Copy,
  Check,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { PublicLayout } from '#/components/public/website/public-layout'
import { usePublicAnnouncements } from '#/api/endpoints/api-mc/public-announcement'
import { getAnnouncementTypeBadge } from '#/lib/announcement-helpers'
import {
  heroTextVariants,
  scrollRevealContainer,
  scrollRevealItem,
  floatVariants,
  floatSlowVariants,
  cardHoverVariants,
} from '#/lib/motion-presets'

export const Route = createFileRoute('/')({
  component: Homepage,
})

const QQ_GROUP = '805030578'

const FEATURES = [
  {
    icon: Users,
    title: '社区互动',
    description:
      '加入锋楪，与志同道合的冒险者一起探索、建造和分享。',
  },
  {
    icon: Globe,
    title: '网页联动',
    description:
      '通过 Yggleaf 平台在网页端管理游戏数据，实现端到端互通。',
  },
  {
    icon: Palette,
    title: '个性装扮',
    description:
      '上传和管理你的 Minecraft 皮肤与披风，展现独特风格。',
  },
]

function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false)
}

function Homepage() {
  const [copied, setCopied] = React.useState(false)

  const handleCopyQQ = React.useCallback(async () => {
    const ok = await copyToClipboard(QQ_GROUP)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  return (
    <PublicLayout>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="dot-grid absolute inset-0" />

        <motion.div
          className="pointer-events-none absolute -left-40 -top-20 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{
            background:
              'oklch(0.52 0.105 223.128 / 0.08)',
          }}
          variants={floatVariants}
          animate="animate"
        />
        <motion.div
          className="pointer-events-none absolute -right-40 -bottom-20 h-[450px] w-[450px] rounded-full blur-[120px]"
          style={{
            background:
              'oklch(0.55 0.15 270 / 0.05)',
          }}
          variants={floatSlowVariants}
          animate="animate"
        />

        <div className="relative z-10 mx-auto max-w-(--page-max) px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col items-center gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.15, delayChildren: 0.2 },
              },
            }}
          >
            <motion.img
              src="/favicon.png"
              alt="锋楪游戏"
              className="h-20 w-20 rounded-2xl object-cover shadow-xl"
              variants={heroTextVariants}
            />

            <motion.h1
              className="text-5xl font-heading font-bold tracking-tight gradient-text lg:text-7xl"
              variants={heroTextVariants}
            >
              锋楪
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground"
              variants={heroTextVariants}
            >
              我的世界社区中心 · 模组服务器
            </motion.p>

            <motion.div variants={heroTextVariants}>
              <Badge
                variant="secondary"
                className="px-4 py-1.5 text-sm font-medium"
              >
                Minecraft 1.21.1 模组服
              </Badge>
            </motion.div>

            <motion.div
              className="mt-4 flex flex-wrap items-center justify-center gap-4"
              variants={heroTextVariants}
            >
              <Button size="lg" className="gap-2" onClick={handleCopyQQ}>
                <Users className="h-4 w-4" />
                加入社区
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">了解更多</Link>
              </Button>
            </motion.div>

            <motion.div
              className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"
              variants={heroTextVariants}
            >
              <span>QQ 群: {QQ_GROUP}</span>
              <button
                type="button"
                onClick={handleCopyQQ}
                className="inline-flex items-center gap-1 rounded-md p-1 transition-colors hover:bg-accent hover:text-foreground"
                aria-label="复制 QQ 群号"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-(--page-max) px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="mb-4 text-center text-3xl font-heading font-bold tracking-tight lg:text-4xl"
            variants={scrollRevealContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <span className="gradient-text">平台特色</span>
          </motion.h2>

          <motion.p
            className="mx-auto mb-16 max-w-2xl text-center text-base text-muted-foreground"
            variants={scrollRevealItem}
          >
            锋楪为 Minecraft 玩家提供全方位的游戏体验增强
          </motion.p>

          <motion.div
            className="grid gap-6 md:grid-cols-3"
            variants={scrollRevealContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={scrollRevealItem}
              >
                <motion.div
                  className="group cursor-default border border-border/50 rounded-2xl p-6 transition-colors hover:border-border"
                  whileHover="hover"
                  animate="rest"
                  variants={cardHoverVariants}
                >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-muted/20">
        <div className="mx-auto max-w-(--page-max) px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 flex items-end justify-between"
            variants={scrollRevealContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <div>
              <h2 className="text-3xl font-heading font-bold tracking-tight lg:text-4xl">
                最新公告
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                了解锋楪最新动态与更新
              </p>
            </div>
            <Link
              to="/announcements"
              className="hidden text-sm font-medium text-primary hover:underline sm:block"
            >
              查看全部公告 &rarr;
            </Link>
          </motion.div>

          <AnnouncementsList />

          <motion.div
            className="mt-8 text-center sm:hidden"
            variants={scrollRevealItem}
          >
            <Link to="/announcements">
              <Button variant="ghost" size="sm">
                查看全部公告 &rarr;
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-glow relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-24 lg:py-32">
        <motion.div
          className="mx-auto max-w-(--page-max) px-4 text-center sm:px-6 lg:px-8"
          variants={scrollRevealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.h2
            className="mb-4 text-3xl font-heading font-bold tracking-tight lg:text-4xl"
            variants={scrollRevealItem}
          >
            加入锋楪的冒险
          </motion.h2>
          <motion.p
            className="mx-auto mb-8 max-w-lg text-base text-muted-foreground"
            variants={scrollRevealItem}
          >
            加入 QQ 群 {QQ_GROUP} 开始你的旅程
          </motion.p>
          <motion.div variants={scrollRevealItem}>
            <Button size="lg" onClick={handleCopyQQ}>
              立即加入
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </PublicLayout>
  )
}

function AnnouncementsList() {
  const { data, isLoading } = usePublicAnnouncements({
    page: 1,
    page_size: 5,
  })

  const list = data?.list ?? []

  if (isLoading) {
    return (
      <div className="space-y-4">
        {['a', 'b', 'c'].map((k) => (
          <div
            key={k}
            className="animate-pulse rounded-2xl border border-border/50 bg-card p-6"
          >
            <div className="mb-3 h-5 w-24 rounded bg-muted" />
            <div className="mb-2 h-6 w-3/5 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-base">暂无公告</p>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-4"
      variants={scrollRevealContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {list.map((item) => (
        <motion.div key={item.id} variants={scrollRevealItem}>
          <Link
            to="/announcements/$id"
            params={{ id: item.id }}
            className="block cursor-pointer rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-border"
          >
            <div className="mb-3 flex items-center gap-3">
              {getAnnouncementTypeBadge(item.type)}
              <span className="shrink-0 text-xs text-muted-foreground">
                {item.published_at
                  ? new Date(item.published_at).toLocaleDateString('zh-CN')
                  : '-'}
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
              {item.title}
            </h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {truncateContent(item.desc)}
            </p>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

function truncateContent(
  content: string | undefined | null,
  len = 100,
): string {
  if (!content) return ''
  if (content.length <= len) return content
  return content.slice(0, len) + '...'
}
