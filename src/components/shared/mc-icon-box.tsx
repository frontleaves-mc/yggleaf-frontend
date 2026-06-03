import { forwardRef } from 'react'

import { cn } from '#/lib/utils'

type McIconBoxVariant = 'grass' | 'diamond' | 'nether' | 'gold'
type McIconBoxSize = 'sm' | 'md' | 'lg'

interface McIconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: McIconBoxVariant
  size?: McIconBoxSize
}

const variantStyles: Record<McIconBoxVariant, string> = {
  grass: 'bg-mc-grass-soft text-mc-grass',
  diamond: 'bg-mc-diamond-soft text-mc-diamond',
  nether: 'bg-mc-nether-soft text-mc-nether',
  gold: 'bg-mc-gold-soft text-mc-gold',
}

const sizeStyles: Record<McIconBoxSize, string> = {
  sm: 'size-8 [&_svg:not([class*=size-])]:size-4',
  md: 'size-11 [&_svg:not([class*=size-])]:size-5',
  lg: 'size-14 [&_svg:not([class*=size-])]:size-6',
}

const McIconBox = forwardRef<HTMLDivElement, McIconBoxProps>(
  ({ variant, size = 'md', className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="mc-icon-box"
      data-variant={variant}
      data-size={size}
      data-mc-accent={variant}
      className={cn(
        'mc-slot inline-flex shrink-0 items-center justify-center',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
McIconBox.displayName = 'McIconBox'

export { McIconBox }
export type { McIconBoxProps, McIconBoxVariant, McIconBoxSize }
