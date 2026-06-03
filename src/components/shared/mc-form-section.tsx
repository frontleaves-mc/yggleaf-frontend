import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { cn } from '#/lib/utils'

interface McFormSectionProps extends React.ComponentProps<typeof Card> {
  title?: string
  description?: string
}

function McFormSection({
  title,
  description,
  className,
  children,
  ...props
}: McFormSectionProps) {
  return (
    <Card surface="panel" className={cn('p-0', className)} {...props}>
      {(title || description) && (
        <CardHeader className="border-b px-5 py-4">
          {title && <CardTitle>{title}</CardTitle>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
      )}
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  )
}

export { McFormSection }
export type { McFormSectionProps }
