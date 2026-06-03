import { Card, CardContent } from '#/components/ui/card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import type { McIconBoxVariant } from '#/components/shared/mc-icon-box'
import { cn } from '#/lib/utils'

interface McStatCardProps extends React.ComponentProps<typeof Card> {
  title: string
  value: React.ReactNode
  description?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  variant?: McIconBoxVariant
}

function McStatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = 'grass',
  className,
  ...props
}: McStatCardProps) {
  return (
    <Card
      surface="block"
      accent={variant}
      interactive
      className={cn('p-0', className)}
      {...props}
    >
      <CardContent className="flex items-center justify-between gap-4 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <div className="mt-1 truncate font-heading text-2xl font-bold tabular-nums text-foreground">
            {value}
          </div>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {Icon && (
          <McIconBox variant={variant} size="md">
            <Icon />
          </McIconBox>
        )}
      </CardContent>
    </Card>
  )
}

export { McStatCard }
export type { McStatCardProps }
