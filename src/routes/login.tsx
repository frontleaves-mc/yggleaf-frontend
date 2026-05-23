import { createFileRoute, redirect } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { getOAuthLoginUrl } from '#/api/endpoints/api-auth/auth'
import {
  LandingBadge,
  LandingButton,
  LandingCard,
} from '#/components/landing/landing-primitives'
import { Button } from '#/components/ui/button'
import { RiseTransition } from '#/components/ui/page-transition'
import brandMd from '#/content/login-brand.md?raw'
import { ensureAuthenticated } from '#/hooks/use-auth-guard'
import { normalizeAuthRedirect, stashAuthRedirect } from '#/lib/auth-redirect'
import { SimpleMarkdown } from '#/lib/markdown'
import {
  hoverLiftTransition,
  landingHeroVariants,
} from '#/lib/motion-presets'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    callback: typeof search.callback === 'string' ? search.callback : undefined,
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  beforeLoad: async ({ search }) => {
    const redirectTo = normalizeAuthRedirect(search.callback || search.redirect)

    if (await ensureAuthenticated()) {
      throw redirect({ to: redirectTo as any })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const search = Route.useSearch()
  const redirectTo = normalizeAuthRedirect(search.callback || search.redirect)

  const handleSSOLogin = () => {
    stashAuthRedirect(redirectTo)
    window.location.href = getOAuthLoginUrl()
  }

  return (
    <div
      data-mode="landing"
      className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]"
    >
      <section className="relative hidden overflow-hidden bg-[oklch(0.16_0.018_238)] text-white lg:flex">
        <div className="absolute inset-0 bg-noise opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(0.18_0.035_146),oklch(0.16_0.018_238)_48%,oklch(0.19_0.045_33))]" />
        <div className="absolute inset-0 opacity-20 mc-grid-pattern" />

        <motion.div
          className="pointer-events-none absolute -left-20 top-1/4 size-72 rounded-full bg-mc-grass/15 blur-[100px]"
          animate={{ y: [-12, 12, -12], x: [-4, 4, -4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute -right-16 bottom-1/3 size-60 rounded-full bg-mc-diamond/12 blur-[90px]"
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute left-1/3 bottom-10 size-48 rounded-full bg-mc-gold/10 blur-[80px]"
          animate={{ y: [-10, 10, -10], x: [-3, 3, -3] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        <RiseTransition className="relative z-10 flex min-h-svh w-full flex-col justify-between px-14 py-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <img
              src="/favicon.png"
              alt="Yggleaf"
              className="size-12 rounded-xl object-cover shadow-lg"
            />
            <div>
              <div className="font-heading text-lg font-semibold tracking-tight">
                <span className="mc-gradient-text">Yggleaf</span>
              </div>
              <div className="text-xs text-white/55">FrontLeaves SSO</div>
            </div>
          </motion.div>

          <motion.div
            initial={landingHeroVariants.hidden}
            animate={landingHeroVariants.visible}
            transition={{
              ...landingHeroVariants.visible.transition,
              delay: 0.15,
            }}
            className="max-w-xl"
          >
            <LandingBadge variant="diamond" className="mb-6">
              <ShieldCheck className="size-3.5" />
              OAuth2 统一认证入口
            </LandingBadge>
            <SimpleMarkdown className="flex flex-col gap-4 text-white/70 [&_blockquote]:border-l [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_blockquote]:text-white/50 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-white [&_hr]:my-2 [&_hr]:border-white/10 [&_li]:leading-7 [&_strong]:font-semibold [&_strong]:text-white/90 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
              {brandMd}
            </SimpleMarkdown>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.35,
            }}
            className="grid grid-cols-3 gap-3 text-sm text-white/70"
          >
            {[
              { label: '资源同步', accent: 'grass' },
              { label: '角色权限', accent: 'diamond' },
              { label: '账号安全', accent: 'gold' },
            ].map((item) => (
              <div
                key={item.label}
                className="landing-glass group relative overflow-hidden rounded-lg border border-white/10 px-4 py-3 transition-all duration-300 hover:border-white/20"
              >
                <div
                  className={`absolute top-0 left-0 h-0.5 w-full ${item.accent === 'grass' ? 'bg-mc-grass' : item.accent === 'diamond' ? 'bg-mc-diamond' : 'bg-mc-gold'}`}
                />
                <span className="relative z-10">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </RiseTransition>
      </section>

      <section className="relative flex items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.53_0.12_130/6%)_0%,transparent_65%)]" />
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />

        <RiseTransition className="relative z-10 w-full max-w-[430px]">
          <div className="mb-10">
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <a href="/">
                <ArrowLeft data-icon="inline-start" />
                返回首页
              </a>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 flex items-center gap-3 lg:hidden"
          >
            <img
              src="/favicon.png"
              alt="Yggleaf"
              className="size-11 rounded-xl object-cover shadow-lg shadow-primary/15"
            />
            <div>
              <div className="font-heading text-base font-semibold tracking-tight">
                <span className="mc-gradient-text">Yggleaf</span>
              </div>
              <div className="text-xs text-muted-foreground">
                by FrontLeaves
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1 },
              tap: { scale: 0.985 },
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <LandingCard className="p-6 sm:p-8 transition-shadow duration-200 hover:shadow-[0_0_0_1px_oklch(from_var(--foreground)_l_c_h/0.12),0_2px_8px_-2px_oklch(from_var(--foreground)_l_c_h/0.06)]">
              <div className="mb-7 flex flex-col gap-3">
                <div className="hidden items-center gap-3 lg:flex">
                  <img
                    src="/favicon.png"
                    alt="Yggleaf"
                    className="size-10 rounded-xl object-cover shadow-lg shadow-primary/15"
                  />
                  <div className="text-sm font-medium text-muted-foreground">
                    统一登录
                  </div>
                </div>

                <LandingBadge variant="grass">
                  <Sparkles className="size-3.5" />
                  登录后返回 {redirectTo}
                </LandingBadge>

                <div>
                  <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                    继续进入锋楪
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    使用 FrontLeaves SSO
                    完成身份验证，继续管理皮肤、披风、档案与工单。
                  </p>
                </div>
              </div>

              <motion.div
                className="w-full"
                initial="rest"
                whileHover="hover"
                transition={hoverLiftTransition}
                variants={{
                  rest: { y: 0 },
                  hover: { y: -2 },
                }}
              >
                <LandingButton
                  type="button"
                  onClick={handleSSOLogin}
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  <ExternalLink data-icon="inline-start" />
                  SSO 安全登录
                </LandingButton>
              </motion.div>

              <div className="mt-5 rounded-md bg-muted/50 px-3 py-2.5 text-xs leading-5 text-muted-foreground">
                若账号尚未完成初始化，登录后会自动进入账号设置流程。
              </div>
            </LandingCard>
          </motion.div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} FrontLeaves</span>
            <span aria-hidden="true">/</span>
            <span>Yggleaf</span>
          </div>
        </RiseTransition>
      </section>
    </div>
  )
}
