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

import { cn } from '#/lib/utils'
import { McIconBox } from '#/components/shared/mc-icon-box'

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

const accentGradientFrom: Record<PageHeaderVariant, string> = {
  grass: 'from-[var(--color-mc-grass)]',
  diamond: 'from-[var(--color-mc-diamond)]',
  nether: 'from-[var(--color-mc-nether)]',
  gold: 'from-[var(--color-mc-gold)]',
  default: 'from-[var(--color-mc-grass)]',
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
  const colorVariant = variant === 'default' ? 'grass' : (variant as Exclude<PageHeaderVariant, 'default'>)

  const isLarge = size === 'lg'

  return (
    <div
      className={cn(
        isLarge
          ? 'mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'
          : 'flex flex-col gap-2',
        className,
      )}
      {...props}
    >
      <div className={cn('min-w-0', isLarge ? 'flex flex-col' : '')}>
        <div className="flex items-center gap-3">
          {Icon && (
            <McIconBox variant={colorVariant} size="md" className="shrink-0">
              <Icon />
            </McIconBox>
          )}
          <div className={cn(!Icon && 'w-full', 'flex flex-col gap-0.5')}>
            <div className="flex items-start gap-2.5">
              {title && isLarge && (
                <h1 className="text-[22px] font-bold tracking-tight text-foreground sm:text-[24px]">
                  {title}
                </h1>
              )}
              {title && !isLarge && (
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </h2>
              )}
              {subtitle && (
                <span className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/50">
                  {subtitle}
                </span>
              )}
            </div>
            {title && (
              <span
                className={cn(
                  'mt-1 block h-[2px] w-12 rounded-full bg-gradient-to-r to-transparent opacity-60',
                  accentGradientFrom[variant],
                )}
              />
            )}
          </div>
        </div>
        {description && (
          <p
            className={cn(
              isLarge
                ? 'mt-1.5 text-[13px] leading-relaxed text-muted-foreground'
                : 'mt-0 text-sm leading-relaxed text-muted-foreground/80',
              Icon && 'pl-[calc(2.75rem+0.75rem)]',
            )}
          >
            {description}
          </p>
        )}
      </div>
      {children && isLarge && (
        <div className="flex items-center gap-2.5 shrink-0 mt-2 sm:mt-0">
          {children}
        </div>
      )}
    </div>
  )
}

export type { PageHeaderProps, PageHeaderVariant }
