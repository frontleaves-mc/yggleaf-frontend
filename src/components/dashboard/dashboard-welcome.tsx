import { motion } from "motion/react";
import type { ServerStatusResponse } from "#/api/types/api-mc/server-status";
import { ServerStatusBar } from "#/components/public/server-status-inline";
import { fadeUpItem } from "#/lib/motion-presets";

interface DashboardWelcomeProps {
	username: string | undefined;
	fallbackName: string;
	server: ServerStatusResponse | undefined;
	serverLoading: boolean;
	showTps?: boolean;
	actions?: React.ReactNode;
	inlineStats?: React.ReactNode;
}

export function DashboardWelcome({
	username,
	fallbackName,
	server,
	serverLoading,
	showTps = false,
	actions,
	inlineStats,
}: DashboardWelcomeProps) {
	return (
		<motion.section
			variants={fadeUpItem}
			className="flex flex-col gap-3 px-1 pt-2 pb-2"
		>
			<div className="flex items-start justify-between gap-4">
				<h1 className="font-heading text-[1.75rem] font-bold tracking-tight text-foreground sm:text-[2.25rem] leading-[1.15]">
					欢迎回来，{username ?? fallbackName}
				</h1>
				{actions}
			</div>
			<ServerStatusBar
				server={server}
				isLoading={serverLoading}
				showTps={showTps}
			/>
			{inlineStats}
		</motion.section>
	);
}
