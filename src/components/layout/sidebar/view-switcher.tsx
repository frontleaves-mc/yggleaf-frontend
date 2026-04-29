/**
 * ViewSwitcher - 视图切换卡片
 *
 * 位于侧边栏 Logo 下方、菜单上方。
 * 管理员角色在用户端显示「切换管理员视图」，
 * 管理员端显示「切换用户视图」。
 * 非管理员用户不显示此卡片。
 */

import { useNavigate } from "@tanstack/react-router";
import { Shield, User } from "lucide-react";
import { useUserInfo } from "#/api/endpoints/api-auth/user";
import { useSidebar } from "#/components/ui/sidebar";
import { isAdmin } from "#/lib/permissions";
import { cn } from "#/lib/utils";

interface ViewSwitcherProps {
	mode: "user" | "admin";
}

export function ViewSwitcher({ mode }: ViewSwitcherProps) {
	const navigate = useNavigate();
	const { data: userInfo } = useUserInfo();
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";

	const show = mode === "user" ? isAdmin(userInfo?.user?.role_name) : true;

	if (!show) return null;

	const isAdminMode = mode === "admin";

	const label = isAdminMode ? "用户视图" : "管理员视图";
	const Icon = isAdminMode ? User : Shield;
	const target = isAdminMode ? "/user/dashboard" : "/admin";

	return (
		<div className="px-3 pt-0 pb-1 group-data-[collapsible=icon]:px-2">
			<button
				type="button"
				onClick={() => navigate({ to: target as any })}
				className={cn(
					"flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left",
					"text-xs font-semibold tracking-wide transition-all duration-200 ease-out",
					"border shadow-[inset_0_1px_0_oklch(from_var(--sidebar-foreground)_l_c_h_/_0.04)]",
					"text-sidebar-foreground/75",
					isAdminMode
						? "bg-gradient-to-r from-[oklch(0.55_0.20_25/0.08)] to-[oklch(0.55_0.20_25/0.03)] border-[oklch(0.55_0.20_25/0.15)] hover:from-[oklch(0.55_0.20_25/0.14)] hover:to-[oklch(0.55_0.20_25/0.06)] hover:border-[oklch(0.55_0.20_25/0.25)] hover:shadow-[0_4px_12px_-4px_oklch(0.55_0.20_25/0.15)]"
						: "bg-gradient-to-r from-sidebar-accent/60 to-sidebar-accent/30 border-sidebar-border/40 hover:from-sidebar-primary/10 hover:to-sidebar-accent/50 hover:border-sidebar-primary/25 hover:text-sidebar-foreground hover:shadow-[0_4px_12px_-4px_oklch(from_var(--sidebar-primary)_l_c_h_/_0.12)]",
					"group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2",
				)}
			>
				<span
					className={cn(
						"flex size-6 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
						isAdminMode
							? "bg-[oklch(0.55_0.20_25/0.12)] text-[oklch(0.55_0.20_25)]"
							: "bg-sidebar-primary/15 text-sidebar-primary",
					)}
				>
					<Icon className="size-3.5" />
				</span>
				{!isCollapsed && <span className="truncate">{label}</span>}
			</button>
		</div>
	);
}
