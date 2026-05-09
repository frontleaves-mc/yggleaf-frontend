import { createFileRoute, redirect } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { getOAuthLoginUrl } from '#/api/endpoints/api-auth/auth'
import { Button } from '#/components/ui/button'
import { RiseTransition } from '#/components/ui/page-transition'
import brandMd from '#/content/login-brand.md?raw'
import { ensureAuthenticated } from '#/hooks/use-auth-guard'
import { normalizeAuthRedirect, stashAuthRedirect } from '#/lib/auth-redirect'
import { SimpleMarkdown } from '#/lib/markdown'
import { hoverLiftTransition } from '#/lib/motion-presets'

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
    <div className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
      <section className="relative hidden overflow-hidden bg-[oklch(0.16_0.018_238)] text-white lg:flex">
        <div className="absolute inset-0 bg-noise opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(0.18_0.035_146),oklch(0.16_0.018_238)_48%,oklch(0.19_0.045_33))]" />
        <div className="absolute inset-0 opacity-20 mc-grid-pattern" />

        <RiseTransition className="relative z-10 flex min-h-svh w-full flex-col justify-between px-14 py-12 xl:px-20">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.png"
              alt="Yggleaf"
              className="size-12 rounded-xl object-cover shadow-lg"
            />
            <div>
              <div className="text-lg font-semibold tracking-tight">
                Yggleaf
              </div>
              <div className="text-xs text-white/55">FrontLeaves SSO</div>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
              <ShieldCheck className="size-3.5" />
              OAuth2 统一认证入口
            </div>
            <SimpleMarkdown className="flex flex-col gap-4 text-white/70 [&_blockquote]:border-l [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_blockquote]:text-white/50 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-white [&_hr]:my-2 [&_hr]:border-white/10 [&_li]:leading-7 [&_strong]:font-semibold [&_strong]:text-white/90 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
              {brandMd}
            </SimpleMarkdown>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm text-white/70">
            {['资源同步', '角色权限', '账号安全'].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3"
              >
                {item}
              </div>
            ))}
          </div>
        </RiseTransition>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-8">
        <RiseTransition className="w-full max-w-[430px]">
          <div className="mb-10">
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <a href="/">
                <ArrowLeft data-icon="inline-start" />
                返回首页
              </a>
            </Button>
          </div>

          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img
              src="/favicon.png"
              alt="Yggleaf"
              className="size-11 rounded-xl object-cover shadow-lg shadow-primary/15"
            />
            <div>
              <div className="text-base font-semibold tracking-tight">
                Yggleaf
              </div>
              <div className="text-xs text-muted-foreground">
                by FrontLeaves
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
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
              <div className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
                <Sparkles className="size-3.5" />
                登录后返回 {redirectTo}
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
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
              <Button
                type="button"
                onClick={handleSSOLogin}
                size="lg"
                className="h-11 w-full rounded-lg text-[15px] font-semibold"
              >
                <ExternalLink data-icon="inline-start" />
                SSO 安全登录
              </Button>
            </motion.div>

            <div className="mt-5 rounded-md bg-muted/50 px-3 py-2.5 text-xs leading-5 text-muted-foreground">
              若账号尚未完成初始化，登录后会自动进入账号设置流程。
            </div>
          </div>

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
