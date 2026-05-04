/**
 * Dashboard 仪表盘
 * 管理后台首页 - 系统概览 + 统计数据 + 快捷操作
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	Flag,
	Gamepad2,
	Palette,
	RefreshCw,
	Shield,
	Shirt,
	Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useCapes } from "#/api/endpoints/api-auth/cape-library";
import { useSkins } from "#/api/endpoints/api-auth/skin-library";
import { useUserInfo } from "#/api/endpoints/api-auth/user";
import {
	useRefreshServerStatusMutation,
	useServerStatus,
} from "#/api/endpoints/api-mc/server-status";
import {
	DashboardCard,
	type DashboardCardConfig,
} from "#/components/dashboard/dashboard-card";
import { DashboardWelcome } from "#/components/dashboard/dashboard-welcome";
import { SectionLabel } from "#/components/dashboard/section-label";
import { LoadingPage } from "#/components/public/loading-page";
import { fadeUpItem, staggerContainer } from "#/lib/motion-presets";

export const Route = createFileRoute("/admin/dashboard")({
	component: DashboardPage,
});

function DashboardPage() {
	const navigate = useNavigate();
	const { data: userInfo, isLoading: userLoading } = useUserInfo();
	const user = userInfo?.user;
	const { data: skins, isLoading: skinsLoading } = useSkins();
	const { data: capes, isLoading: capesLoading } = useCapes();
	const { data: serverStatusData, isLoading: serverLoading } =
		useServerStatus();
	const server = serverStatusData?.[0];
	const refreshMutation = useRefreshServerStatusMutation();

	if (userLoading) return <LoadingPage />;

	const skinCount = skins?.items?.length ?? 0;
	const capeCount = capes?.items?.length ?? 0;

	const refreshButton = server?.server_name ? (
		<button
			type="button"
			onClick={() => {
				refreshMutation.mutate({ name: server.server_name });
			}}
			disabled={refreshMutation.isPending}
			className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border/50 bg-transparent px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground/60 transition-all hover:border-primary/20 hover:text-primary disabled:opacity-50 disabled:pointer-events-none"
		>
			<RefreshCw
				className={`size-3 ${refreshMutation.isPending ? "animate-spin" : ""}`}
			/>
			刷新
		</button>
	) : null;

	const inlineStats = (
		<div className="flex items-baseline gap-5 pt-1">
			<span className="flex items-baseline gap-1.5">
				<span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/35">
					SKINS
				</span>
				<span className="text-[13px] font-semibold tabular-nums text-foreground/80">
					{skinsLoading ? "..." : skinCount}
				</span>
			</span>
			<span className="flex items-baseline gap-1.5">
				<span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/35">
					CAPES
				</span>
				<span className="text-[13px] font-semibold tabular-nums text-foreground/80">
					{capesLoading ? "..." : capeCount}
				</span>
			</span>
		</div>
	);

	const quickActionCards: DashboardCardConfig[] = [
		{
			title: "皮肤库管理",
			description: "浏览、上传、编辑皮肤资源",
			icon: Palette,
			to: "/admin/skins/",
			iconBg: "bg-[oklch(0.55_0.14_25)]/[0.12]",
			iconColor: "text-[oklch(0.45_0.16_25)]",
			accentGradient: "from-[oklch(0.55_0.14_25)]/[0.06] to-transparent",
			glow: "shadow-[0_0_18px_-4px_oklch(0.55_0.14_25_/_0.25)]",
		},
		{
			title: "披风库管理",
			description: "浏览、上传、编辑披风资源",
			icon: Shield,
			to: "/admin/capes/",
			iconBg: "bg-[oklch(0.55_0.15_20)]/[0.12]",
			iconColor: "text-[oklch(0.45_0.17_20)]",
			accentGradient: "from-[oklch(0.55_0.15_20)]/[0.06] to-transparent",
			glow: "shadow-[0_0_18px_-4px_oklch(0.55_0.15_20_/_0.25)]",
		},
	];

	return (
		<motion.div
			className="flex flex-col gap-8"
			variants={staggerContainer}
			initial="initial"
			animate="animate"
		>
			<DashboardWelcome
				username={user?.username}
				fallbackName="管理员"
				server={server}
				serverLoading={serverLoading}
				showTps
				actions={refreshButton}
				inlineStats={inlineStats}
			/>

			<motion.section variants={fadeUpItem} className="flex flex-col gap-4">
				<SectionLabel label="Overview" title="系统概览" />
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
					<div className="border border-border/60 bg-card/90 backdrop-blur-[10px] rounded-[1.125rem] p-5 sm:p-6">
						<div className="flex items-center justify-between gap-4">
							<div className="space-y-1.5 min-w-0">
								<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
									皮肤库
								</p>
								<p
									className={`text-2xl font-bold tracking-tight tabular-nums ${skinsLoading ? "opacity-50" : ""}`}
								>
									{skinsLoading ? "..." : skinCount}
								</p>
								<p className="text-xs text-muted-foreground">总资源数</p>
							</div>
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.55_0.12_223)]/[0.1]">
								<Shirt className="h-5 w-5 text-[oklch(0.45_0.14_223)]" />
							</div>
						</div>
					</div>

					<div className="border border-border/60 bg-card/90 backdrop-blur-[10px] rounded-[1.125rem] p-5 sm:p-6">
						<div className="flex items-center justify-between gap-4">
							<div className="space-y-1.5 min-w-0">
								<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
									披风库
								</p>
								<p
									className={`text-2xl font-bold tracking-tight tabular-nums ${capesLoading ? "opacity-50" : ""}`}
								>
									{capesLoading ? "..." : capeCount}
								</p>
								<p className="text-xs text-muted-foreground">总资源数</p>
							</div>
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.6_0.16_250)]/[0.1]">
								<Flag className="h-5 w-5 text-[oklch(0.48_0.18_250)]" />
							</div>
						</div>
					</div>

					<div className="border border-border/60 bg-card/90 backdrop-blur-[10px] rounded-[1.125rem] p-5 sm:p-6 opacity-50">
						<div className="flex items-center justify-between gap-4">
							<div className="space-y-1.5 min-w-0">
								<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
									游戏档案
								</p>
								<p className="text-2xl font-bold tracking-tight tabular-nums">
									--
								</p>
								<p className="text-xs text-muted-foreground">活跃档案</p>
							</div>
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.6_0.13_160)]/[0.1]">
								<Gamepad2 className="h-5 w-5 text-[oklch(0.48_0.15_160)]" />
							</div>
						</div>
					</div>

					<div className="border border-border/60 bg-card/90 backdrop-blur-[10px] rounded-[1.125rem] p-5 sm:p-6 opacity-50">
						<div className="flex items-center justify-between gap-4">
							<div className="space-y-1.5 min-w-0">
								<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
									用户总数
								</p>
								<p className="text-2xl font-bold tracking-tight tabular-nums">
									--
								</p>
								<p className="text-xs text-muted-foreground">已注册用户</p>
							</div>
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.55_0.15_30)]/[0.1]">
								<Users className="h-5 w-5 text-[oklch(0.45_0.17_30)]" />
							</div>
						</div>
					</div>
				</div>
			</motion.section>

			<motion.section variants={fadeUpItem} className="flex flex-col gap-4">
				<SectionLabel label="Operations" title="快捷操作" />
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{quickActionCards.map((card) => (
						<DashboardCard
							key={card.to}
							{...card}
							onClick={() => navigate({ to: card.to as any })}
						/>
					))}
				</div>
			</motion.section>
		</motion.div>
	);
}
