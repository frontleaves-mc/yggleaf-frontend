import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'

interface McDataTableShellProps extends React.ComponentProps<typeof Card> {}

function McDataTableShell({ className, ...props }: McDataTableShellProps) {
  return (
    <Card
      surface="panel"
      className={cn('overflow-hidden p-0', className)}
      {...props}
    />
  )
}

export { McDataTableShell }
export type { McDataTableShellProps }
