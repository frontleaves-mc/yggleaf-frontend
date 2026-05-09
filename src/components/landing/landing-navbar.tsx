import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Monitor,
  Moon,
  Settings,
  Sun,
  UserIcon,
  UserPlus,
} from 'lucide-react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import * as React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import { useAuth } from '#/hooks/use-auth'
import { checkIsAuthenticated } from '#/hooks/use-auth-guard'
import { useThemeMode } from '#/hooks/use-theme'
import { navVariants, navVariantsDark } from '#/lib/motion-presets'

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

const CRAFTATAR_URL = (uuid: string) =>
  `https://crafatar.com/avatars/${uuid}?size=64`

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

function UserMenu() {
  const { user, logout } = useAuth()

  const gameProfile = Array.isArray(user?.game_profiles)
    ? user.game_profiles.at(0)
    : undefined
  const avatarUrl = gameProfile?.uuid
    ? CRAFTATAR_URL(gameProfile.uuid)
    : undefined
  const displayUsername = gameProfile?.name || user?.username || '玩家'

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = '/'
    } catch {
      // 登出失败时保持当前页面，不中断用户操作
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar size="sm">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayUsername} />}
            <AvatarFallback>
              <UserIcon className="size-3.5" />
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-foreground sm:block">
            {displayUsername}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link to="/user/dashboard">
            <LayoutDashboard className="size-4" />
            进入控制台
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/user/profile">
            <Settings className="size-4" />
            个人设置
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="size-4" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function GuestButtons() {
  return (
    <div className="flex items-center gap-2">
      <Link to="/login" search={{ callback: '/user/dashboard' } as any}>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <LogIn className="h-3.5 w-3.5" />
          登录
        </Button>
      </Link>
      <Link to="/login" search={{ callback: '/user/dashboard' } as any}>
        <Button size="sm" className="gap-1.5">
          <UserPlus className="h-3.5 w-3.5" />
          注册
        </Button>
      </Link>
    </div>
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

export function LandingNavbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
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
      <nav className="mx-auto flex h-full max-w-(--page-max) items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
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
                  layoutId="landing-nav-active"
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
          {isAuthenticated ? <UserMenu /> : <GuestButtons />}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {!isAuthenticated && (
            <Link to="/login" search={{ callback: '/user/dashboard' } as any}>
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
                  <span className="text-sm text-muted-foreground">
                    主题切换
                  </span>
                  <ThemeToggle />
                </div>

                <div className="px-3 py-2">
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                      <UserMenu />
                      <Link
                        to="/user/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        进入控制台
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        to="/login"
                        search={{ callback: '/user/dashboard' } as any}
                        onClick={() => setMobileOpen(false)}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-1.5"
                        >
                          <LogIn className="h-3.5 w-3.5" />
                          登录
                        </Button>
                      </Link>
                      <Link
                        to="/login"
                        search={{ callback: '/user/dashboard' } as any}
                        onClick={() => setMobileOpen(false)}
                      >
                        <Button size="sm" className="w-full gap-1.5">
                          <UserPlus className="h-3.5 w-3.5" />
                          注册
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  )
}
