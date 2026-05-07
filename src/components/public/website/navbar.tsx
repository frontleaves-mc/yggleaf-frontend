/**
 * PublicNavbar — 公共网站顶部导航栏
 * 固定定位，滚动感知透明度变化，桌面/移动端响应式布局
 */

import * as React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { useScroll, useMotionValueEvent } from 'motion/react'
import { motion } from 'motion/react'
import {
  Menu,
  Sun,
  Moon,
  Monitor,
  LogIn,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import { checkIsAuthenticated } from '#/hooks/use-auth-guard'
import { useThemeMode } from '#/hooks/use-theme'
import {
  navVariants,
  navVariantsDark,
} from '#/lib/motion-presets'

interface NavLink {
  label: string
  to: string
}

const NAV_LINKS: NavLink[] = [
  { label: '首页', to: '/' },
  { label: '关于', to: '/about' },
  { label: '公告', to: '/announcements' },
  { label: '社区规则', to: '/rules' },
]

function ThemeToggle() {
  const { mode, changeMode } = useThemeMode()

  const icon =
    mode === 'light' ? (
      <Sun className="size-4" />
    ) : mode === 'dark' ? (
      <Moon className="size-4" />
    ) : (
      <Monitor className="size-4" />
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0 rounded-lg">
          {icon}
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem onClick={() => changeMode('light')}>
          <Sun className="size-4" />
          浅色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeMode('dark')}>
          <Moon className="size-4" />
          深色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeMode('auto')}>
          <Monitor className="size-4" />
          跟随系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface MobileNavLinkProps {
  link: NavLink
  isActive: boolean
  onClick: () => void
}

function MobileNavLink({ link, isActive, onClick }: MobileNavLinkProps) {
  return (
    <Link
      to={link.to}
      onClick={onClick}
      className={`flex items-center rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
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
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
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
              className={`relative px-3 py-2 text-sm font-medium transition-colors ${
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
              <Button variant="outline" size="sm" className="gap-1.5">
                <LogIn className="h-3.5 w-3.5" />
                登录
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {!isAuthenticated && (
            <Link to="/login">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <LogIn className="h-3.5 w-3.5" />
                登录
              </Button>
            </Link>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg">
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
                  <span className="text-sm text-muted-foreground">主题切换</span>
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
