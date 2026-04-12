import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--header-bg)]/60">
      <nav className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
        {/* ── Logo ── */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5 no-underline"
        >
          {/* 方块图标 — 用 clip-path 切出 Minecraft 感的斜角 */}
          <span className="relative flex h-8 w-8 items-center justify-center">
            <span
              className="absolute inset-0 rounded-sm bg-gradient-to-br from-[var(--lagoon)] to-[var(--lagoon-deep)] shadow-sm transition-transform duration-300 group-hover:rotate-12"
              style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
            />
            <span className="relative text-xs font-bold text-white leading-none select-none">Y</span>
          </span>
          <span className="text-base font-bold tracking-tight text-[var(--sea-ink)] sm:text-lg">
            Yggleaf
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <div className="ml-auto hidden items-center gap-1 sm:flex">
          <Link
            to="/"
            className="nav-link px-3 py-2 text-[13px] font-medium text-[var(--sea-ink-soft)] no-underline transition-colors hover:text-[var(--sea-ink)]"
            activeProps={{ className: '!text-[var(--sea-ink)] is-active' }}
          >
            首页
          </Link>
          <Link
            to="/admin"
            className="nav-link px-3 py-2 text-[13px] font-medium text-[var(--sea-ink-soft)] no-underline transition-colors hover:text-[var(--sea-ink)]"
            activeProps={{ className: '!text-[var(--sea-ink)] is-active' }}
          >
            管理后台
          </Link>

          {/* 管理后台按钮 */}
          <a
            href="/admin"
            className="ml-2 inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-[var(--lagoon)] to-[var(--lagoon-deep)] px-4 py-2 text-[13px] font-semibold text-white no-shadow transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-[var(--lagoon)]/20 active:translate-y-0"
          >
            管理后台
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* ── Mobile Toggle ── */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-md text-[var(--sea-ink-soft)] transition-colors hover:bg-[var(--muted)] sm:hidden"
          aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="border-t border-[var(--line)]/60 bg-[var(--card)]/95 backdrop-blur-xl sm:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1 px-4 py-4">
            <Link
              to="/"
              className="rounded-md px-3 py-2.5 text-[14px] font-medium text-[var(--sea-ink)] no-underline hover:bg-[var(--accent)]"
              onClick={() => setMobileOpen(false)}
            >
              首页
            </Link>
            <Link
              to="/admin"
              className="rounded-md px-3 py-2.5 text-[14px] font-medium text-[var(--sea-ink-soft)] no-underline hover:bg-[var(--accent)] hover:text-[var(--sea-ink)]"
              onClick={() => setMobileOpen(false)}
            >
              管理后台
            </Link>
            <div className="mt-2 pt-2 border-t border-[var(--line)]/50">
              <a
                href="/admin"
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[var(--lagoon)] to-[var(--lagoon-deep)] px-4 py-2.5 text-[13px] font-semibold text-white no-underline"
                onClick={() => setMobileOpen(false)}
              >
                管理后台
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
