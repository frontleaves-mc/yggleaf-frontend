/**
 * DataTable - 通用数据表格组件
 * 基于 Shadcn Table 封装，支持排序、分页、选择等
 *
 * 注意：这是一个基础封装，具体使用时可根据需要扩展
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { cn } from '#/lib/utils'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey: (row: T) => string | number
  emptyMessage?: string
  isLoading?: boolean
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  emptyMessage = '暂无数据',
  isLoading = false,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className={cn("rounded-xl border border-[var(--border)] bg-[var(--card)]", className)}>
        <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">加载中...</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn("rounded-xl border border-[var(--border)] bg-[var(--card)]", className)}>
        <div className="py-12 text-center text-sm text-[var(--muted-foreground)]">{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={rowKey(row)}>
              {columns.map((col) => (
                <TableCell key={col.key} className={col.className}>
                  {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
