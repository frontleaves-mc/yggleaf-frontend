import { motion } from 'motion/react'
import { useState } from 'react'
import { useServerStatus } from '#/api/endpoints/api-mc/server-status'
import {
  floatSlowVariants,
  floatVariants,
  landingHeroVariants,
} from '#/lib/motion-presets'
import { LandingBadge, LandingButton } from './landing-primitives'

const QQ_GROUP = '805030578'

function HeroSection() {
  const [copied, setCopied] = useState(false)
  const { data: serverStatus } = useServerStatus()

  const totalOnline =
    serverStatus?.reduce((sum, s) => sum + (s.online_players ?? 0), 0) ?? 0

  const copyQQ = () => {
    navigator.clipboard.writeText(QQ_GROUP).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80" />
      <div className="absolute inset-0 mc-grid-pattern opacity-30" />

      <motion.div
        className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        variants={floatSlowVariants}
        animate="animate"
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-secondary/10 blur-3xl"
        variants={floatVariants}
        animate="animate"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.div
          variants={landingHeroVariants}
          initial="hidden"
          animate="visible"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/favicon.png"
            alt="锋楪"
            className="mx-auto mb-8 h-20 w-20 rounded-2xl mc-glow"
          />
        </motion.div>

        <motion.h1
          variants={landingHeroVariants}
          initial="hidden"
          animate="visible"
          className="font-heading text-6xl font-bold tracking-tight md:text-7xl lg:text-8xl"
        >
          <span className="mc-gradient-text">锋楪</span>
        </motion.h1>

        <motion.p
          variants={landingHeroVariants}
          initial="hidden"
          animate="visible"
          className="mt-4 text-xl text-muted-foreground"
        >
          Minecraft 模组服务器 · 社区中心
        </motion.p>

        <motion.div
          variants={landingHeroVariants}
          initial="hidden"
          animate="visible"
          className="mt-6"
        >
          <LandingBadge variant="diamond">Minecraft 1.21.1 模组服</LandingBadge>
        </motion.div>

        <motion.div
          variants={landingHeroVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 flex justify-center gap-4"
        >
          <LandingButton variant="hero" size="lg" onClick={copyQQ}>
            {copied ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>已复制</title>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                已复制
              </>
            ) : (
              <>加入社区</>
            )}
          </LandingButton>
          <LandingButton variant="outline" size="lg" onClick={scrollToFeatures}>
            了解更多
          </LandingButton>
        </motion.div>

        <motion.div
          variants={landingHeroVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/40 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>
            {totalOnline > 0 ? `${totalOnline} 名玩家在线` : '暂无玩家在线'}
          </span>
        </motion.div>
      </div>
    </section>
  )
}

export { HeroSection }
