import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { MessageCircle, LogIn } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { scrollRevealContainer, scrollRevealItem } from '#/lib/motion-presets'

const NAV_LINKS = [
  { label: '首页', to: '/' },
  { label: '关于', to: '/about' },
  { label: '公告', to: '/announcements' },
  { label: '社区规则', to: '/rules' },
] as const

const RESOURCE_LINKS = [
  { label: '玩家中心', to: '/user/dashboard' },
  { label: '皮肤管理', to: '/user/skins' },
  { label: '工单中心', to: '/user/issues' },
] as const

const QQ_GROUP = '805030578'

function FooterLink({ children, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <li>
      <Link
        className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-none hover:text-primary"
        {...props}
      >
        {children}
      </Link>
    </li>
  )
}

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="landing-section !py-12">
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={scrollRevealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div variants={scrollRevealItem}>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img
                src="/favicon.png"
                alt="锋楪游戏"
                className="size-8 rounded-none object-cover pixel-shadow-sm"
              />
              <span className="font-heading text-lg font-bold tracking-tight font-pixel">
                锋楪游戏
              </span>
            </Link>
            <p className="mt-3 max-w-[240px] text-sm leading-relaxed text-muted-foreground">
              一个 Minecraft 模组服务器社区，为玩家提供独特的游戏体验。
            </p>
          </motion.div>

          <motion.div variants={scrollRevealItem}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/80 font-pixel">
              快速导航
            </h3>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <FooterLink key={link.to} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={scrollRevealItem}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/80 font-pixel">
              资源
            </h3>
            <ul className="flex flex-col gap-2.5">
              {RESOURCE_LINKS.map((link) => (
                <FooterLink key={link.label} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={scrollRevealItem}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/80 font-pixel">
              社区
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="rounded-none border border-border/50 bg-card/50 px-3 py-2 pixel-shadow-sm">
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="size-4 text-primary/70" />
                  QQ 群：
                  <code className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-mono text-primary">
                    {QQ_GROUP}
                  </code>
                </span>
              </li>
              <li>
                <Button size="sm" asChild>
                  <Link
                    to="/login"
                    search={{ callback: '/user/dashboard' } as any}
                  >
                    <LogIn data-icon="inline-start" />
                    进入玩家中心
                  </Link>
                </Button>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground/70">
          © 2024-2026 锋楪游戏（深圳）有限公司
        </div>
      </div>
    </footer>
  )
}
