import { ArrowRight } from 'lucide-react'

import { Card, CardContent } from '#/components/ui/card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import type { McIconBoxVariant } from '#/components/shared/mc-icon-box'
import { cn } from '#/lib/utils'

interface McActionTileProps extends React.ComponentProps<'button'> {
  title: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
  variant?: McIconBoxVariant
}

function McActionTile({
  title,
  description,
  icon: Icon,
  variant = 'grass',
  className,
  ...props
}: McActionTileProps) {
  return (
    <button
      type="button"
      data-slot="mc-action-tile"
      className={cn('block w-full text-left', className)}
      {...props}
    >
      <Card surface="block" accent={variant} interactive className="p-0">
        <CardContent className="flex items-center gap-3 p-4">
          <McIconBox variant={variant} size="sm">
            <Icon />
          </McIconBox>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {title}
            </p>
            {description && (
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <ArrowRight
            className="shrink-0 text-muted-foreground"
            data-icon="inline-end"
          />
        </CardContent>
      </Card>
    </button>
  )
}

export { McActionTile }
export type { McActionTileProps }
