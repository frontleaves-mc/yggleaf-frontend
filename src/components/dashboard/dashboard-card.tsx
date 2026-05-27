import { motion } from 'motion/react'
import type { McIconBoxVariant } from '#/components/shared/mc-icon-box'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import {
  arrowSlideVariants,
  childMotionTransition,
  iconScaleVariants,
} from '#/lib/motion-presets'

export interface DashboardCardConfig {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  to: string
  /** MC 配色变体，映射到 McIconBox */
  iconVariant: McIconBoxVariant
}

interface DashboardCardProps extends DashboardCardConfig {
  onClick: () => void
}

export function DashboardCard({
  title,
  description,
  icon: Icon,
  iconVariant,
  onClick,
}: DashboardCardProps) {
  return (
    <McCard
      variant="glass"
      color={iconVariant === 'nether' ? 'nether' : iconVariant}
    >
      <motion.button
        variants={{
          rest: {},
          hover: {},
        }}
        initial="rest"
        whileHover="hover"
        onClick={onClick}
        className="relative w-full p-5 text-left"
      >
        <div className="relative flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <motion.div
              variants={iconScaleVariants}
              transition={childMotionTransition}
            >
              <McIconBox variant={iconVariant} size="md">
                <Icon />
              </McIconBox>
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
    </McCard>
  )
}
