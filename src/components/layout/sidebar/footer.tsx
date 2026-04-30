/**
 * SidebarFooter - 侧边栏底部区域
 *
 * 用户头像卡片 + 点击展开下拉菜单（个人中心 / 退出登录）
 */

import { useNavigate } from "@tanstack/react-router";
import { LogOut, Settings } from "lucide-react";
import { useUserInfo } from "#/api/endpoints/api-auth/user";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
	SidebarFooter as SidebarFooterRoot,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "#/components/ui/sidebar";
import { cn } from "#/lib/utils";
import { clearAuth } from "#/stores/auth-store";

export function SidebarFooter({ mode = "user" }: { mode?: "user" | "admin" }) {
	const navigate = useNavigate();
	const { data: userInfo } = useUserInfo();
	const user = userInfo?.user;
	const initials = user?.username?.slice(0, 2).toUpperCase() ?? "YK";

	const handleLogout = () => {
		clearAuth();
		navigate({ to: "/login" });
	};

	return (
		<>
			<SidebarRail />

			<SidebarFooterRoot className="p-3 pt-2 group-data-[collapsible=icon]:p-2">
				<div
					className="mx-1 mb-2 h-px bg-gradient-to-r from-transparent via-sidebar-border/60 to-transparent"
					aria-hidden="true"
				/>
				<SidebarMenu className="group-data-[collapsible=icon]:items-center">
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className={cn(
										"rounded-xl border transition-all duration-200 ease-out",
										"shadow-[inset_0_1px_0_oklch(from_var(--sidebar-foreground)_l_c_h_/_0.04)]",
										"data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
										"border-sidebar-border/40 bg-gradient-to-b from-sidebar-accent/50 to-sidebar-accent/30 hover:border-sidebar-primary/20 hover:shadow-[0_4px_12px_-4px_oklch(from_var(--sidebar-primary)_l_c_h_/_0.10)]",
									)}
								>
									<div className="relative">
										<Avatar className="size-8">
											<AvatarFallback
												className={cn(
													"rounded-lg text-xs font-bold",
													"border border-sidebar-primary/15 bg-gradient-to-br from-sidebar-primary/20 via-primary/12 to-primary/8 text-sidebar-primary",
												)}
											>
												{initials}
											</AvatarFallback>
										</Avatar>
										<span className="absolute bottom-0 right-0 size-2 rounded-full border-[1.5px] border-sidebar bg-emerald-500 dark:bg-emerald-400" />
									</div>
									<div className="flex flex-1 flex-col min-w-0">
										<span className="truncate text-sm font-semibold tracking-tight">
											{user?.username ?? "用户"}
										</span>
										<span className="truncate text-[11px] leading-tight text-muted-foreground/80">
											{user?.email ?? "未登录"}
										</span>
									</div>
								</SidebarMenuButton>
							</DropdownMenuTrigger>

							<DropdownMenuContent side="top" align="start" className="w-52">
								<DropdownMenuItem
									onClick={() => navigate({ to: "/user/profile" as any })}
								>
									<Settings className="mr-2 size-4" />
									个人中心
								</DropdownMenuItem>

								<DropdownMenuSeparator />

								<DropdownMenuItem
									onClick={handleLogout}
									className="text-destructive focus:text-destructive"
								>
									<LogOut className="mr-2 size-4" />
									退出登录
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooterRoot>
		</>
	);
}
