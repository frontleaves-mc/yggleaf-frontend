/**
 * SidebarHeader - 侧边栏顶部 Logo 区域
 *
 * 展开时：Logo + 标题 + 副标题
 * 折叠时：仅显示 Logo 图标
 */

import {
	SidebarHeader as SidebarHeaderRoot,
	useSidebar,
} from "#/components/ui/sidebar";
import { cn } from "#/lib/utils";

interface SidebarHeaderProps {
	mode: "user" | "admin";
}

const MODE_LABELS: Record<string, string> = {
	user: "我的世界社区中心",
	admin: "管理控制台",
};

export function SidebarHeader({ mode }: SidebarHeaderProps) {
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";

	return (
		<SidebarHeaderRoot className="relative overflow-hidden p-3">
			<div
				className={cn(
					"pointer-events-none rounded-lg absolute inset-0",
					mode === "admin"
						? "bg-[radial-gradient(ellipse_at_top_left,oklch(0.55_0.20_25/0.10),transparent_70%)]"
						: "bg-[radial-gradient(ellipse_at_top_left,oklch(from_var(--sidebar-primary)_l_c_h/0.12),transparent_70%)]",
				)}
				aria-hidden="true"
			/>
			<div
				className={cn(
					"relative flex items-center gap-3",
					!isCollapsed && "px-1",
				)}
			>
				<img
					src="/favicon.png"
					alt="Yggleaf"
					className={cn(
						"shrink-0 rounded-lg object-cover",
						mode === "admin"
							? "shadow-[0_2px_8px_-4px_oklch(0.55_0.20_25/0.25)]"
							: "shadow-[0_2px_8px_-4px_oklch(from_var(--sidebar-primary)_l_c_h/0.25)]",
						"transition-all duration-300 ease-out",
						isCollapsed ? "mx-auto size-9" : "size-10",
					)}
				/>

				{!isCollapsed && (
					<div className="min-w-0 flex-1">
						<p className="truncate font-heading text-base font-bold tracking-tight leading-tight text-sidebar-foreground">
							锋楪游戏
						</p>
						<p
							className={cn(
								"mt-0.5 text-xs font-medium leading-tight uppercase tracking-[0.16em]",
								mode === "admin"
									? "text-[oklch(0.55_0.20_25)]"
									: "text-sidebar-primary/70",
							)}
						>
							{MODE_LABELS[mode]}
						</p>
					</div>
				)}
			</div>
		</SidebarHeaderRoot>
	);
}
