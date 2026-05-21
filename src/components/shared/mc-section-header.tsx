import type { LucideIcon } from 'lucide-react'
import { cn } from '#/lib/utils'
import { McIconBox } from './mc-icon-box'

type McSectionHeaderVariant = 'grass' | 'diamond' | 'nether' | 'gold' | 'default'

interface McSectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  description?: string
  icon?: LucideIcon
  variant?: McSectionHeaderVariant
}

function McSectionHeader({
  title,
  subtitle,
  description,
  icon: Icon,
  variant = 'default',
  className,
  ...props
}: McSectionHeaderProps) {
  const colorVariant = variant === 'default' ? 'grass' : (variant as Exclude<McSectionHeaderVariant, 'default'>)

  return (
    <div data-slot="mc-section-header" data-variant={variant} className={cn('flex flex-col gap-2', className)} {...props}>
      <div className="flex items-center gap-3">
        {Icon && (
          <McIconBox variant={colorVariant} size="md">
            <Icon />
          </McIconBox>
        )}
        <div className="flex flex-col gap-0.5">
          {subtitle && (
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
              {subtitle}
            </span>
          )}
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
        </div>
      </div>
      {description && (
        <p className="text-sm leading-relaxed text-muted-foreground/80 pl-[calc(2.75rem+0.75rem)]">
          {description}
        </p>
      )}
    </div>
  )
}

export { McSectionHeader }
export type { McSectionHeaderProps, McSectionHeaderVariant }
