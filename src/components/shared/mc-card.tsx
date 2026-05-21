import { forwardRef } from 'react'
import { motion } from 'motion/react'
import { cn } from '#/lib/utils'
import { cardHoverVariants, hoverLiftTransition, landingCardHover } from '#/lib/motion-presets'

type McCardVariant = 'glass' | 'solid'
type McCardColor = 'grass' | 'diamond' | 'nether' | 'gold' | 'default'

interface McCardProps extends React.HTMLAttributes<HTMLDivElement> {
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
  'relative overflow-hidden rounded-xl',
  'border border-border bg-card/80 backdrop-blur-[12px]',
  'shadow-sm',
  'transition-all duration-300',
]

const solidBaseStyles = [
  'relative overflow-hidden rounded-xl',
  'border border-border/60 bg-card',
  'shadow-sm',
  'transition-all duration-300',
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
        variants={landingCardHover}
        initial="rest"
        whileHover="hover"
        transition={hoverLiftTransition}
        className={cn(...baseStyles, className)}
        {...props}
      >
        {color !== 'default' && (
          <div className={cn('absolute inset-x-0 top-0 h-1', accentLineColors[color])} />
        )}
        {children}
      </motion.div>
    )
  },
)
McCard.displayName = 'McCard'

export { McCard }
export type { McCardProps, McCardVariant, McCardColor }
