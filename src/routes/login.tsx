/**
 * 登录页 — OAuth2 SSO 入口
 * 左右分屏布局
 * 左侧: 深色品牌展示区 — FrontLeaves 介绍（从 Markdown 渲染）
 * 右侧: 登录操作区（仅 SSO 按钮）
 * 移动端: 仅显示右侧
 */

import { createFileRoute, redirect } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { getOAuthLoginUrl } from "#/api/endpoints/api-auth/auth";
import { Button } from "#/components/ui/button";
import { RiseTransition } from "#/components/ui/page-transition";
import brandMd from "#/content/login-brand.md?raw";
import { checkIsAuthenticated } from "#/hooks/use-auth-guard";
import { SimpleMarkdown } from "#/lib/markdown";
import { hoverLiftTransition } from "#/lib/motion-presets";

export const Route = createFileRoute("/login")({
	beforeLoad: () => {
		if (checkIsAuthenticated()) {
			throw redirect({ to: "/user/dashboard" as any });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	const handleSSOLogin = () => {
		window.location.href = getOAuthLoginUrl();
	};

	return (
		<div className="flex min-h-screen">
			{/* ─── 左侧: 品牌沉浸区 ─── */}
			<div className="relative hidden w-[55%] overflow-hidden lg:flex lg:flex-col bg-gradient-to-br from-[oklch(0.15_0.05_220)] via-[oklch(0.12_0.045_215)] to-[oklch(0.08_0.04_230)]">
				{/* 装饰光晕 */}
				<div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[oklch(0.45_0.12_200)] opacity-[0.08] blur-[120px]" />
				<div className="pointer-events-none absolute -right-20 bottom-[10%] h-[350px] w-[350px] rounded-full bg-[oklch(0.55_0.10_75)] opacity-[0.04] blur-[100px]" />

				{/* 网格纹理 */}
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage:
							"linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
						backgroundSize: "60px 60px",
					}}
				/>

				{/* 内容 */}
				<RiseTransition className="relative z-10 flex flex-1 flex-col justify-center gap-8 px-14 py-12">
					{/* Logo */}
					<div className="flex items-center gap-3.5">
						<img
							src="/favicon.png"
							alt="Yggleaf"
							className="h-14 w-14 rounded-2xl object-cover shadow-lg"
						/>
						<div className="flex flex-col gap-0.5">
							<span className="text-2xl font-bold tracking-tight text-white">
								Yggleaf
							</span>
							<span className="text-sm text-white/40">by FrontLeaves</span>
						</div>
					</div>

					{/* 品牌介绍 — 从 Markdown 渲染 */}
					<SimpleMarkdown className="max-w-lg space-y-4 text-white/70 [&_h1]:mb-1 [&_h1]:text-[1.75rem] [&_h1]:font-bold [&_h1]:text-white [&_h1]:tracking-tight [&_strong]:text-white/90 [&_strong]:font-semibold [&_hr]:my-5 [&_hr]:border-0 [&_hr]:h-px [&_hr]:bg-white/10 [&_ul]:space-y-2 [&_ul]:mt-2 [&_li]:flex [&_li]:items-start [&_li]:gap-2.5 [&_li_span]:mt-0 [&_blockquote]:mt-3 [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-3.5 [&_blockquote]:text-white/50 [&_blockquote]:italic">
						{brandMd}
					</SimpleMarkdown>
				</RiseTransition>

				{/* 底部版权 */}
				<div className="relative z-10 px-14 pb-8 text-xs text-white/20">
					&copy; {new Date().getFullYear()} FrontLeaves &middot; Yggleaf
				</div>
			</div>

			{/* ─── 右侧: 登录操作区 ─── */}
			<div className="flex flex-1 items-center justify-center bg-background p-6">
				<RiseTransition className="flex w-full max-w-[400px] flex-col items-center gap-8">
					{/* 移动端 Logo */}
					<div className="flex flex-col items-center gap-3 lg:hidden">
						<img
							src="/favicon.png"
							alt="Yggleaf"
							className="h-12 w-12 rounded-xl object-cover shadow-lg shadow-primary/15"
						/>
						<div className="flex flex-col items-center gap-0.5">
							<span className="text-lg font-bold text-foreground">Yggleaf</span>
							<span className="text-xs text-muted-foreground">
								by FrontLeaves
							</span>
						</div>
					</div>

					{/* 标题区域 */}
					<div className="flex flex-col items-center gap-3 text-center">
						{/* 桌面端 Logo */}
						<div className="hidden items-center gap-3 lg:flex">
							<img
								src="/favicon.png"
								alt="Yggleaf"
								className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-primary/15"
							/>
						</div>
						<h2 className="text-[1.75rem] font-bold tracking-tight text-foreground">
							欢迎回来
						</h2>
						<p className="max-w-[280px] text-sm leading-relaxed text-muted-foreground">
							通过统一认证平台登录，继续管理你的 Minecraft 资源与账号。
						</p>
					</div>

					{/* SSO 登录按钮 */}
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
							className="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/90 text-[15px] font-semibold text-white shadow-lg shadow-primary/20 transition-shadow hover:shadow-xl hover:shadow-primary/30"
						>
							<span className="relative z-10 flex items-center justify-center gap-2">
								<ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
								SSO 安全登录
							</span>
							<div className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/10" />
						</Button>
					</motion.div>

					{/* 底部提示 */}
					<p className="text-center text-xs leading-relaxed text-muted-foreground/60">
						还没有账号？请先在 SSO 平台完成注册与授权。
					</p>
				</RiseTransition>
			</div>
		</div>
	);
}
