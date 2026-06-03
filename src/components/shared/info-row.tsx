import type { ElementType, ReactNode } from 'react'
import { McIconBox } from './mc-icon-box'

export function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-none bg-muted/40 px-4 py-3">
      <span className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
        <McIconBox variant="nether" size="sm">
          <Icon />
        </McIconBox>
        {label}
      </span>
      <span className="text-[13px] font-medium">{value}</span>
    </div>
  )
}
