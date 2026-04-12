/**
 * BreadcrumbNav - 面包屑导航组件
 * 基于 TanStack Router 的 useMatches 动态生成
 *
 * 深度优化:
 *   - 首页用图标代替文字，更紧凑
 *   - 分隔符用极淡的斜杠而非箭头
 *   - 当前页面包屑截断保护
 */

import { useMatches } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Home } from 'lucide-react'
import { breadcrumbLabels } from '#/config/menu'

export function BreadcrumbNav() {
  const matches = useMatches({
    select: (matches) => matches.filter((m) => m.pathname !== '/'),
  })

  // 构建面包屑项
  const crumbs = [
    { label: '首页', to: '/admin' },
    ...matches
      .filter((m) => m.pathname !== '/admin')
      .map((m) => ({
        label: breadcrumbLabels[m.routeId] || m.pathname.split('/').pop() || '页面',
        to: m.pathname,
      })),
  ]

  if (crumbs.length <= 1) return null

  return (
    <nav aria-label="面包屑导航" className="flex items-center gap-0.5 text-[13px] min-w-0">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1

        return (
          <span key={crumb.to} className="flex items-center gap-0.5 min-w-0">
            {index > 0 && (
              <span className="text-[var(--muted-foreground)]/25 mx-1 select-none">/</span>
            )}
            {isLast ? (
              <span className="font-semibold text-[var(--foreground)] truncate max-w-[220px]">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.to}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] truncate max-w-[120px] transition-colors duration-150"
              >
                {index === 0 ? (
                  <Home className="h-3.5 w-3.5" />
                ) : (
                  <span className="truncate">{crumb.label}</span>
                )}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
