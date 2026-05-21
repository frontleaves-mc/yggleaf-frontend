/**
 * PublicFooter — 公共网站底部
 * 四列布局（品牌 / 导航 / 资源 / 社区）+ 底部版权栏
 */

import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { scrollRevealContainer, scrollRevealItem } from '#/lib/motion-presets'
import { NAV_LINKS } from '#/lib/nav-links'
import { ThemeToggle } from '#/components/public/theme-toggle'

const RESOURCE_LINKS = [
  { label: '游戏文档', href: '#' },
  { label: '服务器状态', href: '#' },
  { label: '认证平台', href: '#' },
]

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
          <motion.div
            variants={scrollRevealItem}
            className="col-span-2 lg:col-span-1"
          >
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
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}
