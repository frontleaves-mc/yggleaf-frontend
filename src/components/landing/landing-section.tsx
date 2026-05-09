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
    <section id={id} className={cn('landing-section', className)}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={landingFadeInUp}
      >
        {title && (
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
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
