/**
 * PublicNavbar — 公共网站顶部导航栏
 * 固定定位，滚动感知透明度变化，桌面/移动端响应式布局
 */

import * as React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { useScroll, useMotionValueEvent, motion  } from 'motion/react'
import { Menu, LogIn } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import { checkIsAuthenticated } from '#/hooks/use-auth-guard'
import { navVariants, navVariantsDark } from '#/lib/motion-presets'
import { NAV_LINKS, type NavLink } from '#/lib/nav-links'
import { ThemeToggle } from '#/components/public/theme-toggle'

function MobileNavLink({ link, isActive, onClick }: MobileNavLinkProps) {
  return (
    <Link
      to={link.to}
      onClick={onClick}
      className={`flex min-h-[44px] cursor-pointer items-center rounded-lg px-3 py-3 text-base font-medium transition-colors ${
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
      }`}
    >
      {link.label}
    </Link>
  )
}

export function PublicNavbar() {
  const location = useLocation()
  const pathname = location.pathname
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const isAuthenticated = checkIsAuthenticated()

  const isDark =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')
  const variants = isDark ? navVariantsDark : navVariants

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest >= 50)
  })

  const isActive = (to: string): boolean => {
    if (to === '/') return pathname === '/'
    return pathname.startsWith(to)
  }

  return (
    <motion.header
      className={`fixed top-0 z-50 h-16 w-full border-b transition-colors ${
        scrolled ? 'border-border/40' : 'border-transparent'
      }`}
      variants={variants}
      animate={scrolled ? 'solid' : 'transparent'}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <div className="mx-auto flex h-full max-w-(--page-max) items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex cursor-pointer items-center gap-2.5 shrink-0">
          <img
            src="/favicon.png"
            alt="锋楪游戏"
            className="h-8 w-8 rounded-lg object-cover shadow-sm"
          />
          <span className="hidden text-base font-semibold tracking-tight text-foreground sm:block">
            锋楪游戏
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative cursor-pointer px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md ${
                isActive(link.to)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
              {isActive(link.to) && (
                <motion.span
                  layoutId="navbar-active-indicator"
                  className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary"
                  transition={{
                    type: 'spring',
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {!isAuthenticated && (
            <Link to="/login">
              <Button variant="outline" size="sm" className="cursor-pointer gap-1.5">
                <LogIn className="h-3.5 w-3.5" />
                登录
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {!isAuthenticated && (
            <Link to="/login">
              <Button variant="outline" size="sm" className="cursor-pointer gap-1.5 text-xs">
                <LogIn className="h-3.5 w-3.5" />
                登录
              </Button>
            </Link>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer rounded-lg" aria-label="打开导航菜单">
                <Menu className="size-5" />
                <span className="sr-only">打开菜单</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" showCloseButton>
              <SheetHeader>
                <SheetTitle>导航菜单</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <MobileNavLink
                    key={link.to}
                    link={link}
                    isActive={isActive(link.to)}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
                <div className="my-3 border-t border-border/60" />
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-muted-foreground">
                    主题切换
                  </span>
                  <ThemeToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
