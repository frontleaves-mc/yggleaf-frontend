import { motion } from 'motion/react'
import { landingFadeInUp } from '#/lib/motion-presets'
import { cn } from '#/lib/utils'

interface LandingSectionProps {
  id?: string
  className?: string
  children: React.ReactNode
  title?: string
  subtitle?: string
}

/**
 * Landing 区块容器 — 自动触发滚动揭示动画
 *
 * - whileInView + once 确保进入视口时只播一次
 * - title 使用 Minecraft 渐变色
 * - 搭配 styles.css 中的 .landing-section / .section-glow 样式
 */
function LandingSection({
  id,
  className,
  children,
  title,
  subtitle,
}: LandingSectionProps) {
  return (
    <section id={id} className={cn('landing-section section-glow', className)}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={landingFadeInUp}
      >
        {title && (
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              <span className="mc-gradient-text">{title}</span>
            </h2>
            {subtitle && (
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </motion.div>
    </section>
  )
}

export { LandingSection }
