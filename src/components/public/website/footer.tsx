/**
 * PublicFooter — 公共网站底部
 * 四列布局（品牌 / 导航 / 资源 / 社区）+ 底部版权栏
 */

import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  Sun,
  Moon,
  Monitor,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { useThemeMode } from '#/hooks/use-theme'
import { scrollRevealContainer, scrollRevealItem } from '#/lib/motion-presets'

const NAV_LINKS = [
  { label: '首页', to: '/' },
  { label: '关于', to: '/about' },
  { label: '公告', to: '/announcements' },
  { label: '社区规则', to: '/rules' },
]

const RESOURCE_LINKS = [
  { label: '游戏文档', href: '#' },
  { label: '服务器状态', href: '#' },
  { label: '认证平台', href: '#' },
]

function FooterThemeToggle() {
  const { mode, changeMode } = useThemeMode()

  const icon =
    mode === 'light' ? (
      <Sun className="size-3.5" />
    ) : mode === 'dark' ? (
      <Moon className="size-3.5" />
    ) : (
      <Monitor className="size-3.5" />
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
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

export function PublicFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <motion.div
        className="mx-auto max-w-(--page-max) px-4 py-16 sm:px-6 lg:px-8"
        variants={scrollRevealContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <motion.div variants={scrollRevealItem} className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/favicon.png"
                alt="锋楪游戏"
                className="h-8 w-8 rounded-lg object-cover shadow-sm"
              />
              <span className="text-base font-semibold tracking-tight text-foreground">
                锋楪游戏
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              我的世界社区中心
            </p>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground/70">
              &copy; {new Date().getFullYear()} FrontLeaves &middot; Yggleaf
            </p>
          </motion.div>

          <motion.div variants={scrollRevealItem}>
            <h3 className="mb-4 text-sm font-semibold text-foreground">导航</h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={scrollRevealItem}>
            <h3 className="mb-4 text-sm font-semibold text-foreground">资源</h3>
            <ul className="space-y-2.5">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  <span className="text-sm text-muted-foreground">
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={scrollRevealItem}>
            <h3 className="mb-4 text-sm font-semibold text-foreground">社区</h3>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm text-muted-foreground">
                  QQ 群: 805030578
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">GitHub</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      <div className="border-t border-border/30">
        <div className="mx-auto flex max-w-(--page-max) items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground/60">
            &copy; 2024-2026 FrontLeaves &middot; Yggleaf
          </p>
          <FooterThemeToggle />
        </div>
      </div>
    </footer>
  )
}
