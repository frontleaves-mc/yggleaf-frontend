/**
 * 游戏档案列表页
 * 展示所有游戏档案，支持创建新档案和查看详情
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, UserCircle } from "lucide-react";
import { motion } from "motion/react";
import type { GameProfile } from "#/api/types";
import { PageHeader } from "#/components/public/page-header";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import type { ColumnDef } from "#/components/ui/tanstack-table";
import {
	TableColumnHeader,
	TableProvider,
	TSTableBody,
	TSTableCell,
	TSTableHead,
	TSTableHeader,
	TSTableHeaderGroup,
	TSTableRow,
} from "#/components/ui/tanstack-table";

// 临时数据（API 对接后替换为真实查询）
const mockProfiles: GameProfile[] = [];

const staggerContainer = {
	animate: {
		transition: { staggerChildren: 0.08, delayChildren: 0.05 },
	},
};

const fadeUpItem = {
	initial: { opacity: 0, y: 16 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
	},
};

export const Route = createFileRoute("/admin/game-profiles/")({
	component: GameProfileListPage,
});

function GameProfileListPage() {
	const columns: ColumnDef<GameProfile, unknown>[] = [
		{
			accessorKey: "id",
			header: ({ column }) => <TableColumnHeader column={column} title="ID" />,
			cell: ({ row }) => {
				const item = row.original;
				return (
					<span className="tabular-nums text-muted-foreground">#{item.id}</span>
				);
			},
			size: 64,
		},
		{
			accessorKey: "name",
			header: ({ column }) => (
				<TableColumnHeader column={column} title="玩家名称" />
			),
			cell: ({ row }) => {
				const item = row.original;
				return (
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
							<UserCircle className="h-4 w-4 text-primary" />
						</div>
						<span className="font-medium">{item.name}</span>
					</div>
				);
			},
		},
		{
			accessorKey: "uuid",
			header: ({ column }) => (
				<TableColumnHeader column={column} title="UUID" />
			),
			cell: ({ row }) => {
				const item = row.original;
				return (
					<span className="font-mono text-xs text-muted-foreground">
						{item.uuid.slice(0, 8)}...
					</span>
				);
			},
		},
		{
			accessorKey: "updated_at",
			header: ({ column }) => (
				<TableColumnHeader column={column} title="更新时间" />
			),
			cell: ({ row }) => {
				const item = row.original;
				return (
					<span className="text-[13px] text-muted-foreground">
						{new Date(item.updated_at).toLocaleDateString("zh-CN")}
					</span>
				);
			},
			size: 128,
		},
		{
			id: "actions",
			header: () => <span className="text-sm font-medium">操作</span>,
			cell: ({ row }) => {
				const item = row.original;
				return (
					<Link to={`/admin/game-profiles/${item.id}` as any}>
						<Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
							<Eye className="mr-1 h-3 w-3" />
							详情
						</Button>
					</Link>
				);
			},
			size: 80,
		},
	];

	return (
		<motion.div
			className="space-y-6"
			variants={staggerContainer}
			initial="initial"
			animate="animate"
		>
			<motion.div variants={fadeUpItem}>
				<PageHeader
					title="游戏档案管理"
					description="管理所有玩家的 Minecraft 游戏档案"
				>
					<Badge variant="secondary" className="text-xs">
						接口开发中
					</Badge>
				</PageHeader>
			</motion.div>

			<motion.div variants={fadeUpItem}>
				<div className="rounded-xl border border-border/70 overflow-hidden">
					<TableProvider columns={columns} data={mockProfiles}>
						<TSTableHeader>
							{({ headerGroup }) => (
								<TSTableHeaderGroup headerGroup={headerGroup}>
									{({ header }) => <TSTableHead header={header} />}
								</TSTableHeaderGroup>
							)}
						</TSTableHeader>
						<TSTableBody>
							{({ row }) => (
								<TSTableRow row={row}>
									{({ cell }) => <TSTableCell cell={cell} />}
								</TSTableRow>
							)}
						</TSTableBody>
					</TableProvider>
					{mockProfiles.length === 0 && (
						<div className="py-16 text-center">
							<p className="text-sm text-muted-foreground">
								暂无游戏档案数据，完整列表接口开发中
							</p>
						</div>
					)}
				</div>
			</motion.div>
		</motion.div>
	);
}
