import { Card, CardContent } from '#/components/ui/card'
import { cn } from '#/lib/utils'

interface McEmptyStateProps extends React.ComponentProps<typeof Card> {
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  actions?: React.ReactNode
}

function McEmptyState({
  title,
  description,
  icon: Icon,
  actions,
  className,
  ...props
}: McEmptyStateProps) {
  return (
    <Card surface="slot" className={cn('p-0', className)} {...props}>
      <CardContent className="flex flex-col items-center gap-3 px-6 py-8 text-center">
        {Icon && <Icon className="text-muted-foreground" />}
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions}
      </CardContent>
    </Card>
  )
}

export { McEmptyState }
export type { McEmptyStateProps }
