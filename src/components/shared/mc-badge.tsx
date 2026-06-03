import { forwardRef } from 'react'
import { cn } from '#/lib/utils'

type McBadgeVariant = 'grass' | 'diamond' | 'nether' | 'gold' | 'default'

interface McBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: McBadgeVariant
}

const badgeVariants: Record<McBadgeVariant, string> = {
  grass: 'bg-mc-grass/15 text-mc-grass border-mc-grass/25',
  diamond: 'bg-mc-diamond/15 text-mc-diamond border-mc-diamond/25',
  nether: 'bg-mc-nether/15 text-mc-nether border-mc-nether/25',
  gold: 'bg-mc-gold/15 text-mc-gold border-mc-gold/25',
  default: 'bg-muted text-muted-foreground border-border/50',
}

const McBadge = forwardRef<HTMLSpanElement, McBadgeProps>(
  ({ variant = 'default', className, children, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="mc-badge"
      data-variant={variant}
      className={cn(
        'inline-flex items-center gap-1 rounded-none px-2 py-0.5 text-xs font-medium pixel-border-raised transition-colors',
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  ),
)
McBadge.displayName = 'McBadge'

export { McBadge }
export type { McBadgeProps, McBadgeVariant }
