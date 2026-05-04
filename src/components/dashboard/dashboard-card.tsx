import { motion } from 'motion/react'
import {
  arrowSlideVariants,
  cardHoverVariants,
  childMotionTransition,
  decorationLineVariants,
  hoverLiftTransition,
  iconScaleVariants,
} from '#/lib/motion-presets'

export interface DashboardCardConfig {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  to: string
  iconBg: string
  iconColor: string
  accentGradient: string
  glow?: string
}

interface DashboardCardProps extends DashboardCardConfig {
  onClick: () => void
}

export function DashboardCard({
  title,
  description,
  icon: Icon,
  iconBg,
  iconColor,
  accentGradient,
  glow,
  onClick,
}: DashboardCardProps) {
  return (
    <motion.button
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      transition={hoverLiftTransition}
      onClick={onClick}
      className="group relative overflow-hidden rounded-[1.125rem] border border-border/60 bg-card/90 p-5 text-left shadow-[0_16px_40px_-28px_oklch(0.18_0.025_195_/_0.18)] backdrop-blur-[10px] transition-colors hover:border-border/50"
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />
      <motion.div
        variants={decorationLineVariants}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute bottom-0 left-5 h-[2px] w-8 rounded-full bg-gradient-to-r from-primary/50 to-transparent"
      />

      <div className="relative flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <motion.div
            variants={iconScaleVariants}
            transition={childMotionTransition}
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${glow ?? ''} transition-shadow group-hover:shadow-md`}
          >
            <Icon className={`size-5 ${iconColor}`} />
          </motion.div>
          <motion.span
            variants={arrowSlideVariants}
            transition={childMotionTransition}
          >
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
              className="text-muted-foreground/40 transition-colors group-hover:text-primary"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </motion.span>
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-foreground/90">
            {title}
          </h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground/75">
            {description}
          </p>
        </div>
      </div>
    </motion.button>
  )
}
