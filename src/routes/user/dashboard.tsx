/**
 * 用户端仪表盘 - 玩家控制中心
 *
 * 布局：12 列网格 (左 8 右 4)
 *   - 左侧：沉浸式欢迎英雄区 + 快速导航卡片
 *   - 右侧：游戏配置速查卡 + 服务器公告
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  Flag,
  Gamepad2,
  KeyRound,
  Mail,
  Server,
  ShieldCheck,
  Shirt,
  Sparkles,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useUserInfo } from '#/api/endpoints/api-auth/user'
import { useServerStatus } from '#/api/endpoints/api-mc/server-status'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  arrowSlideVariants,
  cardHoverVariants,
  childMotionTransition,
  decorationLineVariants,
  hoverLiftTransition,
  iconScaleVariants,
} from '#/lib/motion-presets'

export const Route = createFileRoute('/user/dashboard')({
  component: DashboardPage,
})

// ─── 快速导航配置 ───────────────────────────────────────

const quickLinks = [
  {
    key: 'skins',
    title: '皮肤库',
    desc: '浏览和选择你的角色皮肤',
    icon: Shirt,
    to: '/user/skins',
    accent: 'from-[oklch(0.55_0.12_223)]/[0.08] to-transparent',
    iconBg: 'bg-[oklch(0.55_0.12_223)]/[0.1]',
    iconColor: 'text-[oklch(0.45_0.14_223)]',
    glow: 'shadow-[0_0_20px_-5px_oklch(0.52_0.105_223.128_/_0.15)]',
  },
  {
    key: 'capes',
    title: '披风库',
    desc: '挑选独一无二的披风',
    icon: Flag,
    to: '/user/capes',
    accent: 'from-[oklch(0.6_0.16_250)]/[0.08] to-transparent',
    iconBg: 'bg-[oklch(0.6_0.16_250)]/[0.1]',
    iconColor: 'text-[oklch(0.48_0.18_250)]',
    glow: 'shadow-[0_0_20px_-5px_oklch(0.6_0.16_250_/_0.12)]',
  },
  {
    key: 'profiles',
    title: '游戏档案',
    desc: '管理你的游戏角色档案',
    icon: Gamepad2,
    to: '/user/profiles',
    accent: 'from-[oklch(0.6_0.13_160)]/[0.07] to-transparent',
    iconBg: 'bg-[oklch(0.6_0.13_160)]/[0.1]',
    iconColor: 'text-[oklch(0.48_0.15_160)]',
    glow: 'shadow-[0_0_20px_-5px_oklch(0.6_0.13_160_/_0.11)]',
  },
]

// ─── Stagger 入场动画常量 ──────────────────────────────

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
}

const fadeUpItem = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const fadeUpDelay = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.2,
    },
  },
}

const fadeUpDelay2 = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.35,
    },
  },
}

// ─── 页面组件 ─────────────────────────────────────────────

/** 将 Unix 时间戳（秒）转换为相对时间描述 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = Math.floor((now - timestamp * 1000) / 1000)
  if (diff < 60) return `${diff}秒前`
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  return `${Math.floor(diff / 86400)}天前`
}

function DashboardPage() {
  const navigate = useNavigate()
  const { data: userInfo } = useUserInfo()
  const { data: serverStatusData, isLoading: serverLoading } = useServerStatus()
  const server = serverStatusData?.[0] // 仅取第一台服务器（当前只有一台）
  const user = userInfo?.user
  const spotlightStats = [
    { label: '资源中心', value: '24/7', icon: Server },
    { label: '认证状态', value: 'Secure', icon: ShieldCheck },
    { label: '体验标签', value: 'Polished', icon: Sparkles },
  ]

  return (
    <motion.div
      className="grid grid-cols-1 gap-6 lg:grid-cols-12"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="flex flex-col gap-6 lg:col-span-8"
        variants={fadeUpItem}
      >
        <section className="group relative overflow-hidden rounded-[1.25rem] border border-border/70 bg-gradient-to-b from-card to-card/95 p-4.5 sm:p-7 shadow-[0_16px_40px_-28px_oklch(0.18_0.025_195_/_0.18)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-16 size-72 rounded-full bg-[radial-gradient(circle,oklch(from_var(--primary)_l_c_h_/_0.06),transparent_70%)]" />
            <div className="absolute -bottom-10 -left-10 size-56 rounded-full bg-primary/4 blur-3xl" />
            <div className="absolute right-[20%] top-[30%] size-32 rounded-full border border-primary/[0.04]" />
            <div className="absolute left-[10%] bottom-[15%] size-24 rotate-45 rounded-sm border border-primary/[0.03]" />
            <motion.div
              className="absolute right-[15%] top-[20%] size-3 rounded-full bg-primary/20"
              animate={{ y: [0, -8, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute left-[25%] bottom-[25%] size-2 rounded-full bg-primary/15"
              animate={{ y: [0, 6, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            />
          </div>

          <div className="relative flex flex-col gap-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-background/75 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur-[6px]">
              <Sparkles className="size-3.5" />
              玩家中心
            </div>
            <div className="flex flex-col gap-2.5">
              <h1 className="font-display text-[2rem] font-bold tracking-tight text-foreground sm:text-[2.5rem] leading-[1.15]">
                欢迎回来，
                <span className="bg-gradient-to-r from-foreground to-foreground/65 bg-clip-text text-transparent">
                  {user?.username ?? '冒险者'}
                </span>
                。
              </h1>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground/85">
                这里把皮肤、披风和游戏档案整理成一个更清晰的工作台。你可以更快找到资源、同步角色形象，也能一眼看到当前账号状态。
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {spotlightStats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="group/stat inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-background/80 px-3.5 py-2 shadow-[inset_0_1px_0_oklch(1_0_0_/_0.45),0_1px_2px_oklch(0_0_0_/_0.03)] backdrop-blur-[6px] transition-colors hover:border-primary/20"
                >
                  <div className="flex size-6 items-center justify-center rounded-md bg-primary/8">
                    <Icon className="size-3.5 text-primary transition-transform group-hover/stat:scale-110" />
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">
                    {label}
                  </span>
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                Quick Access
              </p>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                从这里开始切换你的资源
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {quickLinks.map((link) => (
              <motion.button
                key={link.key}
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
                transition={hoverLiftTransition}
                onClick={() => navigate({ to: link.to as any })}
                className="group relative overflow-hidden rounded-[1.125rem] border border-border/60 bg-card/90 p-5 text-left shadow-[0_16px_40px_-28px_oklch(0.18_0.025_195_/_0.18)] backdrop-blur-[10px] transition-colors hover:border-border/50"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${link.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <motion.div
                  variants={decorationLineVariants}
                  transition={{ duration: 0.3 }}
                  className="pointer-events-none absolute bottom-0 left-5 h-[2px] w-8 rounded-full bg-gradient-to-r from-primary/50 to-transparent"
                />

                <div className="relative flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <motion.div
                      variants={iconScaleVariants}
                      transition={childMotionTransition}
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${link.iconBg} ${link.glow} transition-shadow group-hover:shadow-md`}
                    >
                      <link.icon className={`size-5 ${link.iconColor}`} />
                    </motion.div>
                    <motion.span
                      variants={arrowSlideVariants}
                      transition={childMotionTransition}
                    >
                      <ArrowRight className="size-4 text-muted-foreground/40 transition-colors group-hover:text-primary" />
                    </motion.span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-foreground/90">
                      {link.title}
                    </h3>
                    <p className="text-[13px] leading-7 text-muted-foreground/75">
                      {link.desc}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      </motion.div>

      <motion.aside
        className="flex flex-col gap-6 lg:col-span-4"
        variants={fadeUpDelay}
      >
        <Card className="ring-0 relative overflow-hidden border border-border/60 bg-card/95 shadow-[0_16px_40px_-28px_oklch(0.18_0.025_195_/_0.18)]">
          <div className="pointer-events-none absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />

          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/[0.03] shadow-[0_0_12px_-3px_oklch(0.52_0.105_223.128_/_0.12)]">
                <Gamepad2 className="size-[18px] text-primary" />
              </div>
              <div className="flex flex-col gap-0.5">
                <CardTitle className="text-base">游戏配置指南</CardTitle>
                <CardDescription className="text-xs">
                  使用以下信息登录游戏客户端
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-background/70 p-3.5 backdrop-blur-[4px]">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.06]">
                <Mail className="size-4 text-primary/80" />
              </div>
              <div className="min-w-0 flex flex-col gap-0.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                  登录账号
                </span>
                <span className="truncate text-sm font-semibold text-foreground">
                  {user?.email ?? '加载中…'}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-background/70 p-3.5 backdrop-blur-[4px]">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.06]">
                <KeyRound className="size-4 text-primary/80" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                  登录密码
                </span>
                <span className="text-sm font-semibold text-foreground">
                  在本平台设置的密码
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <a
              href="https://game-doc.frontleaves.com/docs/yggdrasil"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border/60 bg-background/80 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/20 hover:bg-primary/[0.04] hover:text-primary"
            >
              <BookOpen className="size-4" />
              查看登录详细文档
              <ExternalLink className="size-3 text-muted-foreground/50" />
            </a>
          </CardFooter>
        </Card>

        <motion.div variants={fadeUpDelay2}>
          <Card className="ring-0 relative overflow-hidden border border-border/60 bg-card/95 shadow-[0_16px_40px_-28px_oklch(0.18_0.025_195_/_0.18)]">
            <div
              className={`pointer-events-none absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r ${server?.online ? 'from-emerald-500/50 via-emerald-500/20 to-transparent dark:from-emerald-400/40' : 'from-red-500/50 via-red-500/20 to-transparent dark:from-red-400/40'}`}
            />

            <CardHeader className="gap-2 pb-4">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">服务器状态</CardTitle>
                {server ? (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                      server.online
                        ? 'border-emerald-500/15 bg-emerald-500/[0.06] text-emerald-600 dark:text-emerald-400'
                        : 'border-red-500/15 bg-red-500/[0.06] text-red-600 dark:text-red-400'
                    }`}
                  >
                    <span
                      className={`size-1.5 animate-pulse rounded-full bg-current`}
                    />
                    {server.online ? '运行中' : '已离线'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-current" />
                    {serverLoading ? '...' : '暂无数据'}
                  </span>
                )}
              </div>
              <CardDescription className="text-xs">
                Minecraft 服务器实时状态
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {server ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/70 p-3.5 backdrop-blur-[4px]">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.06]">
                      <Server className="size-4 text-primary/80" />
                    </div>
                    <div className="min-w-0 flex flex-col gap-0.5">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                        服务器名称
                      </span>
                      <span className="truncate text-sm font-semibold text-foreground">
                        {server.server_name}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1 rounded-xl border border-border/40 bg-background/70 p-3 backdrop-blur-[4px]">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                        TPS
                      </span>
                      <span className="text-lg font-bold tabular-nums text-foreground">
                        {serverLoading ? '...' : server.tps.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl border border-border/40 bg-background/70 p-3 backdrop-blur-[4px]">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                        在线玩家
                      </span>
                      <span className="text-lg font-bold tabular-nums text-foreground">
                        {serverLoading ? '...' : server.online_players}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                    <span>
                      最后心跳：{formatRelativeTime(server.last_heartbeat)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-4">
                  <p className="text-sm text-muted-foreground/60">
                    {serverLoading ? '加载中...' : '暂无服务器数据'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.aside>
    </motion.div>
  )
}
