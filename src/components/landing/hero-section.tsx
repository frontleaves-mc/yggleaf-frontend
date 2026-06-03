import { motion } from 'motion/react'
import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'
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

function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mql.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}

function HeroSection() {
  const [copied, setCopied] = useState<'qq' | 'server' | null>(null)
  const prefersReduced = usePrefersReducedMotion()
  const motionState = prefersReduced ? 'visible' : undefined
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
      <div className="absolute inset-0 grid grid-cols-2 opacity-50 md:grid-cols-4">
        {heroImages.map((src) => (
          <img
            key={src}
            src={src}
            alt="锋楪游戏 Minecraft 服务器截图"
            loading="lazy"
            className="h-full w-full object-cover"
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-background/85" />

      <div className="relative z-10 mx-auto flex w-full max-w-(--page-max) flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <motion.div
          variants={landingHeroVariants}
          initial={motionState ?? 'hidden'}
          animate={motionState ?? 'visible'}
          className="mb-6 inline-flex items-center gap-2 rounded-none border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary"
        >
          <ShieldCheck className="size-3.5 text-primary" />
          白名单模组生存 · Java 1.21.1
        </motion.div>

        <motion.h1
          variants={landingHeroVariants}
          initial={motionState ?? 'hidden'}
          animate={motionState ?? 'visible'}
          className="max-w-4xl font-pixel font-heading text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mc-gradient-text"
        >
          锋楪游戏
        </motion.h1>

        <motion.p
          variants={landingHeroVariants}
          initial={motionState ?? 'hidden'}
          animate={motionState ?? 'visible'}
          className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9"
        >
          面向长期生存与社区协作的 Minecraft
          模组服务器。官网负责账号、皮肤、披风、公告与工单，让玩家不用在游戏内外反复找入口。
        </motion.p>

        <motion.div
          variants={landingHeroVariants}
          initial={motionState ?? 'hidden'}
          animate={motionState ?? 'visible'}
          className="mc-panel mt-10 flex w-full max-w-xl flex-col gap-3 p-4 text-left sm:flex-row sm:items-center"
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
          initial={motionState ?? 'hidden'}
          animate={motionState ?? 'visible'}
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
          initial={motionState ?? 'hidden'}
          animate={motionState ?? 'visible'}
          className="mt-14 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3"
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
          className="mc-panel mt-12 inline-flex cursor-pointer items-center gap-2 px-5 py-2 text-sm font-medium text-foreground transition-none hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
    <div className="mc-panel px-5 py-4 text-left transition-none">
      <div className="mb-2.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="size-4 text-primary" />
        {label}
      </div>
      <div className="text-2xl font-bold tracking-tight text-foreground">
        {value}
      </div>
    </div>
  )
}

export { HeroSection }
