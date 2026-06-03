import { forwardRef } from 'react'

import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'

type McBadgeVariant = 'grass' | 'diamond' | 'nether' | 'gold' | 'default'

interface McBadgeProps extends Omit<
  React.ComponentProps<typeof Badge>,
  'variant'
> {
  variant?: McBadgeVariant
}

const McBadge = forwardRef<HTMLSpanElement, McBadgeProps>(
  ({ variant = 'default', className, children, ...props }, ref) => (
    <Badge
      ref={ref}
      data-slot="mc-badge"
      variant={variant === 'default' ? 'secondary' : variant}
      className={cn('font-medium', className)}
      {...props}
    >
      {children}
    </Badge>
  ),
)
McBadge.displayName = 'McBadge'

export { McBadge }
export type { McBadgeProps, McBadgeVariant }
