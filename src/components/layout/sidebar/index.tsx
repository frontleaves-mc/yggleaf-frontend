/**
 * Sidebar - 统一侧边栏
 *
 * 基于 shadcn Sidebar，组装 Header / Content / Footer
 * 通过 props 接收 mode 和 menu 配置
 */

import {
	SidebarContent,
	Sidebar as SidebarRoot,
} from "#/components/ui/sidebar";
import { SidebarFooter } from "./footer";
import { SidebarHeader } from "./header";
import type { MenuConfig } from "./menu-renderer";
import { SidebarMenuRenderer } from "./menu-renderer";
import { ViewSwitcher } from "./view-switcher";

interface SidebarProps {
	mode: "user" | "admin";
	items: MenuConfig[];
}

export function Sidebar({ mode, items }: SidebarProps) {
	return (
		<SidebarRoot
			collapsible="icon"
			variant="floating"
			style={
				{
					"--sidebar-width-icon": "4.5rem",
					"--sidebar-mode-accent": "oklch(from var(--sidebar-primary) l c h)",
				} as React.CSSProperties
			}
			className="overflow-hidden rounded-tl-2xl group-data-[variant=floating]:shadow-[0_16px_40px_-28px_oklch(0.18_0.025_195_/_0.18)]"
			data-mode={mode}
		>
			<SidebarHeader mode={mode} />

			<div className="px-4 pt-1 pb-3" aria-hidden="true">
				<div className="h-px bg-gradient-to-r from-transparent via-sidebar-border/80 to-transparent" />
			</div>

			<ViewSwitcher mode={mode} />

			<SidebarContent>
				<SidebarMenuRenderer items={items} mode={mode} />
			</SidebarContent>

			<SidebarFooter mode={mode} />
		</SidebarRoot>
	);
}
