/**
 * PageHeader - 统一的页面/区块标题组件
 *
 * 合并了原 PageHeader 与 McSectionHeader 的功能。
 * 支持两种模式：
 *   - 页面级标题（默认）：h1 + 渐变线 + description
 *   - 区块标题（size="sm"）：h2 + 渐变线 + description
 *
 * 布局：
 *   图标 + [subtitle] + h1/h2 + 渐变线  ← 同行垂直居中
 *   description                        ← 另起一行，与标题文字左侧对齐
 */

import { McPageHeader } from '#/components/shared/mc-page-header'

type PageHeaderVariant = 'grass' | 'diamond' | 'nether' | 'gold' | 'default'

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  /** MC 配色变体，影响图标、渐变线颜色 */
  variant?: PageHeaderVariant
  /** 尺寸模式：lg=页面级标题(h1)，sm=区块标题(h2) */
  size?: 'lg' | 'sm'
  /** 右侧操作区 */
  children?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  description,
  icon: Icon,
  variant = 'default',
  size = 'lg',
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <McPageHeader
      title={title}
      subtitle={subtitle}
      description={description}
      icon={Icon}
      variant={variant}
      size={size}
      actions={children}
      className={className}
      {...props}
    >
      {children}
    </McPageHeader>
  )
}

export type { PageHeaderProps, PageHeaderVariant }
