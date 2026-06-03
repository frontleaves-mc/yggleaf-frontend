import { forwardRef } from 'react'
import type { HTMLMotionProps } from 'motion/react'
import { motion } from 'motion/react'

import type { CardAccent, CardSurface } from '#/components/ui/card'
import { cn } from '#/lib/utils'
import { hoverLiftTransition, mcCardHover } from '#/lib/motion-presets'

type McCardVariant = 'glass' | 'solid'
type McCardColor = 'grass' | 'diamond' | 'nether' | 'gold' | 'default'

interface McCardProps extends HTMLMotionProps<'div'> {
  variant?: McCardVariant
  color?: McCardColor
  surface?: CardSurface
  interactive?: boolean
}

function resolveAccent(color: McCardColor): CardAccent {
  return color === 'default' ? 'none' : color
}

function resolveSurface(surface?: CardSurface) {
  return surface ?? 'panel'
}

const McCard = forwardRef<HTMLDivElement, McCardProps>(
  (
    {
      variant = 'glass',
      color = 'default',
      surface,
      interactive = true,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedSurface = resolveSurface(surface)
    const resolvedAccent = resolveAccent(color)
    const hasMaterialLayer = resolvedSurface === 'block'

    return (
      <motion.div
        ref={ref}
        data-slot="mc-card"
        data-variant={variant}
        data-color={color}
        data-mc-surface={resolvedSurface}
        data-mc-accent={resolvedAccent}
        data-mc-interactive={interactive ? 'true' : undefined}
        variants={interactive ? mcCardHover : undefined}
        initial={interactive ? 'rest' : undefined}
        whileHover={interactive ? 'hover' : undefined}
        whileTap={
          interactive
            ? { y: 0.5, scale: 0.995, transition: { duration: 0.1 } }
            : undefined
        }
        transition={hoverLiftTransition}
        className={cn(
          'group relative overflow-hidden rounded-none bg-card text-card-foreground',
          resolvedSurface === 'block' ? 'pt-5' : '',
          className,
        )}
        {...props}
      >
        {hasMaterialLayer ? (
          <span data-slot="mc-card-material" aria-hidden="true" />
        ) : null}
        {children as React.ReactNode}
      </motion.div>
    )
  },
)
McCard.displayName = 'McCard'

export { McCard }
export type { McCardProps, McCardVariant, McCardColor }
