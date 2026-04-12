/**
 * 登录页 - OAuth2 SSO 入口
 * 左侧: 深色品牌展示面板（与 Admin 侧边栏统一视觉）
 * 右侧: SSO 登录按钮
 * 移动端: 仅显示右侧
 *
 * 流程:
 *   1. 用户点击「SSO 安全登录」→ window.location.href = 后端 /sso/oauth/login
 *   2. 后端返回 302 → 浏览器跟随重定向到 auth.frontleaves.com
 *   3. SSO 完成认证后回调到前端 /callback?code=xxx&state=xxx
 *   4. /callback 路由负责用授权码换 Token → 跳转管理后台
 */

import { createFileRoute, redirect } from '@tanstack/react-router'
import { getOAuthLoginUrl } from '#/api/endpoints/auth'
import { checkIsAuthenticated } from '#/hooks/use-auth-guard'
import { Button } from '#/components/ui/button'
import { ShieldCheck, Shirt, Flag, ExternalLink } from 'lucide-react'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (checkIsAuthenticated()) {
      throw redirect({ to: '/admin/' as any })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const handleSSOLogin = () => {
    // 直接导航到后端 OAuth 登录接口，后端返回 302 到 SSO 提供商
    window.location.href = getOAuthLoginUrl()
  }

  return (
    <div className="flex min-h-screen">
      {/* ═══ 左侧品牌面板 (≥md 可见) ═══ */}
      <div className="relative hidden w-[480px] shrink-0 items-center justify-center overflow-hidden bg-[#111f23] md:flex">
        {/* 背景装饰 */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full bg-[var(--lagoon)]/8 blur-[80px]" />
          <div className="absolute -bottom-16 -right-16 h-[250px] w-[250px] rounded-full bg-[var(--lagoon-deep)]/6 blur-[60px]" />
          {/* 网格纹理 */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 px-12">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--lagoon)] to-[var(--lagoon-deep)] text-white text-2xl font-bold shadow-xl shadow-[var(--lagoon)]/20"
              style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
            >
              Y
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white tracking-tight">Yggleaf</h1>
              <p className="mt-1 text-[13px] text-white/30">Minecraft Resource Platform</p>
            </div>
          </div>

          {/* 分隔线 */}
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[var(--lagoon)]/30 to-transparent" />

          {/* 功能亮点 */}
          <div className="w-full max-w-[280px] space-y-4">
            <FeatureItem
              icon={<Shirt className="h-4 w-4" />}
              label="皮肤管理"
              desc="上传和管理 Minecraft 皮肤资源"
            />
            <FeatureItem
              icon={<Flag className="h-4 w-4" />}
              label="披风管理"
              desc="完整的披风资源管理与纹理追踪"
            />
            <FeatureItem
              icon={<ShieldCheck className="h-4 w-4" />}
              label="安全认证"
              desc="OAuth 2.0 + PKCE 安全认证体系"
            />
          </div>

          {/* 底部版权 */}
          <p className="mt-auto text-[11px] text-white/15">
            &copy; {new Date().getFullYear()} FrontLeaves MC
          </p>
        </div>
      </div>

      {/* ═══ 右侧登录区域 ═══ */}
      <div className="flex flex-1 items-center justify-center bg-[var(--background)] px-6 py-12">
        <div className="w-full max-w-[380px]">
          {/* 移动端 Logo（桌面端隐藏） */}
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--lagoon)] to-[var(--lagoon-deep)] text-white text-sm font-bold shadow-lg shadow-[var(--lagoon)]/15"
              style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
            >
              Y
            </div>
            <span className="text-lg font-bold text-[var(--foreground)]">Yggleaf</span>
          </div>

          {/* 标题 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">欢迎回来</h2>
            <p className="mt-2 text-[14px] text-[var(--muted-foreground)]">
              通过 SSO 安全登录 Minecraft 资源管理平台
            </p>
          </div>

          {/* SSO 登录入口 */}
          <div className="space-y-4">
            <Button
              type="button"
              onClick={handleSSOLogin}
              className="h-12 w-full bg-gradient-to-r from-[var(--lagoon)] to-[var(--lagoon-deep)] text-white text-[15px] font-semibold hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              SSO 安全登录
            </Button>

            <div className="flex items-center gap-3 py-2">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-[11px] text-[var(--muted-foreground)]">通过统一认证平台</span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            {/* 安全提示 */}
            <div className="rounded-lg border border-[var(--border)]/50 bg-[var(--card)] p-3">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--lagoon)]" />
                <div>
                  <p className="text-[12px] font-medium text-[var(--foreground)]">安全登录</p>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    使用 OAuth 2.0 安全认证，密码由 SSO 提供商托管，本平台不存储密码
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 底部提示 */}
          <p className="mt-8 text-center text-[12px] text-[var(--muted-foreground)]">
            还没有账号？请先在 SSO 平台注册
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── 左侧面板功能条目 ─── */

function FeatureItem({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--lagoon)]/10 text-[var(--lagoon)]"
        style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[13px] font-medium text-white/70">{label}</p>
        <p className="text-[12px] text-white/25">{desc}</p>
      </div>
    </div>
  )
}
