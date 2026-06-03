import { McIconBox } from '#/components/shared/mc-icon-box'
import { cn } from '#/lib/utils'

type McPageHeaderVariant = 'grass' | 'diamond' | 'nether' | 'gold' | 'default'

interface McPageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  variant?: McPageHeaderVariant
  size?: 'lg' | 'sm'
  actions?: React.ReactNode
}

const accentClass: Record<McPageHeaderVariant, string> = {
  grass: 'bg-mc-grass',
  diamond: 'bg-mc-diamond',
  nether: 'bg-mc-nether',
  gold: 'bg-mc-gold',
  default: 'bg-[var(--mc-accent)]',
}

function McPageHeader({
  title,
  subtitle,
  description,
  icon: Icon,
  variant = 'default',
  size = 'lg',
  actions,
  className,
  children,
  ...props
}: McPageHeaderProps) {
  const iconVariant = variant === 'default' ? 'grass' : variant
  const isLarge = size === 'lg'

  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <McIconBox variant={iconVariant} size={isLarge ? 'md' : 'sm'}>
              <Icon />
            </McIconBox>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              {title && (
                <div
                  className={cn(
                    'truncate font-heading font-bold tracking-tight text-foreground',
                    isLarge ? 'text-2xl' : 'text-lg',
                  )}
                >
                  {title}
                </div>
              )}
              {subtitle && (
                <span className="font-pixel-alt text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  {subtitle}
                </span>
              )}
            </div>
            {title && (
              <span
                className={cn(
                  'mt-2 block h-1 w-16 border border-black/10',
                  accentClass[variant],
                )}
              />
            )}
          </div>
        </div>
        {description && (
          <p
            className={cn(
              'mt-2 text-sm leading-relaxed text-muted-foreground',
              Icon && (isLarge ? 'sm:pl-14' : 'sm:pl-11'),
            )}
          >
            {description}
          </p>
        )}
      </div>
      {(actions || children) && (
        <div className="flex shrink-0 items-center gap-2">
          {actions ?? children}
        </div>
      )}
    </div>
  )
}

export { McPageHeader }
export type { McPageHeaderProps, McPageHeaderVariant }
