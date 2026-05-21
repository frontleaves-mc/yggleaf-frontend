import { forwardRef } from 'react'
import type { HTMLMotionProps } from 'motion/react'
import { motion } from 'motion/react'
import { cn } from '#/lib/utils'
import { hoverLiftTransition, mcCardHover } from '#/lib/motion-presets'

type McCardVariant = 'glass' | 'solid'
type McCardColor = 'grass' | 'diamond' | 'nether' | 'gold' | 'default'

interface McCardProps extends HTMLMotionProps<'div'> {
  variant?: McCardVariant
  color?: McCardColor
}

const accentLineColors: Record<Exclude<McCardColor, 'default'>, string> = {
  grass: 'bg-mc-grass',
  diamond: 'bg-mc-diamond',
  nether: 'bg-mc-nether',
  gold: 'bg-mc-gold',
}

const glassBaseStyles = [
  'group relative overflow-hidden rounded-xl',
  'border border-border bg-card/80 backdrop-blur-[12px]',
  'shadow-sm cursor-pointer',
  'transition-colors duration-300',
]

const solidBaseStyles = [
  'group relative overflow-hidden rounded-xl',
  'border border-border/60 bg-card',
  'shadow-sm cursor-pointer',
  'transition-colors duration-300',
]

const McCard = forwardRef<HTMLDivElement, McCardProps>(
  ({ variant = 'glass', color = 'default', className, children, ...props }, ref) => {
    const baseStyles = variant === 'glass' ? glassBaseStyles : solidBaseStyles

    return (
      <motion.div
        ref={ref}
        data-slot="mc-card"
        data-variant={variant}
        data-color={color}
        variants={mcCardHover}
        initial="rest"
        whileHover="hover"
        whileTap={{ y: 0.5, scale: 0.995, transition: { duration: 0.1 } }}
        transition={hoverLiftTransition}
        className={cn(...baseStyles, className)}
        {...props}
      >
        {color !== 'default' && (
          <div
            className={cn(
              'absolute left-0 top-5 bottom-5 w-[3px] rounded-full opacity-40 transition-opacity duration-300 group-hover:opacity-80',
              accentLineColors[color],
            )}
          />
        )}
        {children as React.ReactNode}
      </motion.div>
    )
  },
)
McCard.displayName = 'McCard'

export { McCard }
export type { McCardProps, McCardVariant, McCardColor }
