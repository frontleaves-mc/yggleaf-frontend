import { motion } from 'motion/react'
import type { ComponentType } from 'react'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowDown,
  Check,
  Copy,
  Gauge,
  LogIn,
  Server,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { useServerStatus } from '#/api/endpoints/api-mc/server-status'
import { Button } from '#/components/ui/button'
import { landingHeroVariants } from '#/lib/motion-presets'

const QQ_GROUP = '805030578'
const SERVER_ADDRESS = 'mc.frontleaves.com'

const heroImages = [
  '/images/gallery/gallery-1.svg',
  '/images/gallery/gallery-2.svg',
  '/images/gallery/gallery-4.svg',
  '/images/gallery/gallery-5.svg',
]

function HeroSection() {
  const [copied, setCopied] = useState<'qq' | 'server' | null>(null)
  const { data: serverStatus } = useServerStatus()
  const statusList = Array.isArray(serverStatus) ? serverStatus : []

  const totalOnline = statusList.reduce((sum, s) => sum + s.online_players, 0)
  const onlineServers = statusList.filter((s) => s.online).length
  const averageTps =
    statusList.length > 0
      ? statusList.reduce((sum, s) => sum + s.tps, 0) / statusList.length
      : 0

  const copyText = (value: string, key: 'qq' | 'server') => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-2 opacity-35 md:grid-cols-4">
        {heroImages.map((src) => (
          <img
            key={src}
            src={src}
            alt=""
            className="h-full w-full object-cover"
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-background/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      <div className="absolute inset-0 bg-noise" />

      <div className="relative z-10 mx-auto flex w-full max-w-(--page-max) flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <motion.div
          variants={landingHeroVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur"
        >
          <ShieldCheck className="size-3.5 text-primary" />
          白名单模组生存 · Java 1.21.1
        </motion.div>

        <motion.h1
          variants={landingHeroVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl font-heading text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          锋楪游戏
        </motion.h1>

        <motion.p
          variants={landingHeroVariants}
          initial="hidden"
          animate="visible"
          className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg"
        >
          面向长期生存与社区协作的 Minecraft
          模组服务器。官网负责账号、皮肤、披风、公告与工单，让玩家不用在游戏内外反复找入口。
        </motion.p>

        <motion.div
          variants={landingHeroVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 flex w-full max-w-xl flex-col gap-3 rounded-lg border border-border bg-background/80 p-3 text-left shadow-sm backdrop-blur sm:flex-row sm:items-center"
        >
          <div className="min-w-0 flex-1 px-1">
            <div className="text-xs text-muted-foreground">服务器地址</div>
            <div className="truncate font-mono text-base font-semibold text-foreground">
              {SERVER_ADDRESS}
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => copyText(SERVER_ADDRESS, 'server')}
          >
            {copied === 'server' ? (
              <Check data-icon="inline-start" />
            ) : (
              <Copy data-icon="inline-start" />
            )}
            复制地址
          </Button>
        </motion.div>

        <motion.div
          variants={landingHeroVariants}
          initial="hidden"
          animate="visible"
          className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button size="lg" asChild className="h-11 w-full sm:w-auto">
            <Link to="/login" search={{ callback: '/user/dashboard' } as any}>
              <LogIn data-icon="inline-start" />
              登录玩家中心
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => copyText(QQ_GROUP, 'qq')}
            className="h-11 w-full sm:w-auto"
          >
            {copied === 'qq' ? (
              <Check data-icon="inline-start" />
            ) : (
              <Copy data-icon="inline-start" />
            )}
            QQ 群 {QQ_GROUP}
          </Button>
        </motion.div>

        <motion.div
          variants={landingHeroVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3"
        >
          <HeroMetric
            icon={Users}
            label="在线玩家"
            value={totalOnline > 0 ? `${totalOnline} 人` : '待加入'}
          />
          <HeroMetric
            icon={Server}
            label="节点状态"
            value={onlineServers > 0 ? `${onlineServers} 个在线` : '同步中'}
          />
          <HeroMetric
            icon={Gauge}
            label="平均 TPS"
            value={averageTps > 0 ? averageTps.toFixed(1) : '获取中'}
          />
        </motion.div>

        <button
          type="button"
          onClick={scrollToFeatures}
          className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          查看服务器内容
          <ArrowDown className="size-4" />
        </button>
      </div>
    </section>
  )
}

function HeroMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-border bg-background/72 px-4 py-3 text-left shadow-sm backdrop-blur">
      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="size-3.5 text-primary" />
        {label}
      </div>
      <div className="text-lg font-semibold tracking-tight text-foreground">
        {value}
      </div>
    </div>
  )
}

export { HeroSection }
