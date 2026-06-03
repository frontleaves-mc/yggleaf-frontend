import { forwardRef } from 'react'
import { cn } from '#/lib/utils'

type McIconBoxVariant = 'grass' | 'diamond' | 'nether' | 'gold'
type McIconBoxSize = 'sm' | 'md' | 'lg'

interface McIconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: McIconBoxVariant
  size?: McIconBoxSize
}

const variantStyles: Record<McIconBoxVariant, string> = {
  grass: 'icon-box-grass',
  diamond: 'icon-box-diamond',
  nether: 'icon-box-nether',
  gold: 'icon-box-gold',
}

const sizeStyles: Record<McIconBoxSize, string> = {
  sm: 'size-8 rounded-none [&_svg]:size-4',
  md: 'size-11 rounded-none [&_svg]:size-5',
  lg: 'size-14 rounded-none [&_svg]:size-6',
}

const McIconBox = forwardRef<HTMLDivElement, McIconBoxProps>(
  ({ variant, size = 'md', className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="mc-icon-box"
      data-variant={variant}
      data-size={size}
      className={cn(
        'icon-box inline-flex items-center justify-center',
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
