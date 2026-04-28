/**
 * 皮肤库列表页
 * 展示所有皮肤资源，支持查看、编辑、删除操作
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Plus, Shirt, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
	useDeleteSkinMutation,
	useSkins,
} from "#/api/endpoints/api-auth/skin-library";
import type { SkinLibrary } from "#/api/types";
import { ConfirmDialog } from "#/components/public/confirm-dialog";
import { LoadingPage } from "#/components/public/loading-page";
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

/** stagger 容器动画 - 子元素依次入场 */
const staggerContainer = {
	animate: {
		transition: { staggerChildren: 0.08, delayChildren: 0.05 },
	},
};

/** 单项淡入上移动画 */
const fadeUpItem = {
	initial: { opacity: 0, y: 16 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
	},
};

export const Route = createFileRoute("/admin/skins/")({
	component: SkinListPage,
});

function SkinListPage() {
	const { data, isLoading } = useSkins();
	const skins = data?.items;
	const deleteMutation = useDeleteSkinMutation();
	const [deleteTarget, setDeleteTarget] = useState<SkinLibrary | null>(null);

	const handleDelete = async () => {
		if (!deleteTarget) return;
		try {
			await deleteMutation.mutateAsync(deleteTarget.id);
			setDeleteTarget(null);
		} catch {
			// 错误由 mutation error handling 处理
		}
	};

	const columns: ColumnDef<SkinLibrary, unknown>[] = [
		{
			accessorKey: "id",
			header: ({ column }) => <TableColumnHeader column={column} title="ID" />,
			cell: ({ row }) => (
				<span className="tabular-nums text-muted-foreground">
					#{row.original.id}
				</span>
			),
			size: 64,
		},
		{
			accessorKey: "name",
			header: ({ column }) => (
				<TableColumnHeader column={column} title="名称" />
			),
			cell: ({ row }) => (
				<div className="flex items-center gap-2.5">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
						<Shirt className="h-4 w-4 text-primary" />
					</div>
					<span className="font-medium">{row.getValue("name") as string}</span>
				</div>
			),
		},
		{
			accessorKey: "model",
			header: ({ column }) => (
				<TableColumnHeader column={column} title="模型" />
			),
			cell: ({ row }) => (
				<Badge variant="secondary" className="font-mono text-xs">
					{row.original.model === 1 ? "Classic" : "Slim"}
				</Badge>
			),
			size: 80,
		},
		{
			accessorKey: "is_public",
			header: ({ column }) => (
				<TableColumnHeader column={column} title="状态" />
			),
			cell: ({ row }) => {
				const isPublic = row.original.is_public;
				return (
					<Badge
						variant={isPublic ? "default" : "secondary"}
						className={
							isPublic
								? "bg-chart-2/10 text-chart-2 hover:bg-chart-2/15 border-chart-2/20"
								: ""
						}
					>
						{isPublic ? "公开" : "私有"}
					</Badge>
				);
			},
			size: 72,
		},
		{
			accessorKey: "updated_at",
			header: ({ column }) => (
				<TableColumnHeader column={column} title="更新时间" />
			),
			cell: ({ row }) => (
				<span className="text-[13px] text-muted-foreground">
					{new Date(row.original.updated_at).toLocaleDateString("zh-CN")}
				</span>
			),
			size: 128,
		},
		{
			id: "actions",
			header: () => <span>操作</span>,
			cell: ({ row }) => {
				const skin = row.original;
				return (
					<div className="flex items-center gap-1">
						<Link to={`/admin/skins/${skin.id}` as any}>
							<Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
								<Pencil className="mr-1 h-3 w-3" />
								编辑
							</Button>
						</Link>
						<Button
							variant="ghost"
							size="sm"
							className="h-7 px-2 text-xs text-destructive hover:text-destructive/90 hover:bg-destructive/10"
							onClick={() => setDeleteTarget(skin)}
						>
							<Trash2 className="mr-1 h-3 w-3" />
							删除
						</Button>
					</div>
				);
			},
			size: 128,
		},
	];

	if (isLoading) return <LoadingPage />;

	return (
		<motion.div
			className="space-y-6"
			variants={staggerContainer}
			initial="initial"
			animate="animate"
		>
			<motion.div variants={fadeUpItem}>
				<PageHeader
					title="皮肤库管理"
					description="管理和预览所有 Minecraft 皮肤资源"
				>
					<Link to="/admin/skins/create">
						<Button className="gap-1.5 bg-gradient-to-r from-primary to-primary text-white hover:opacity-90 text-sm">
							<Plus className="h-4 w-4" />
							新建皮肤
						</Button>
					</Link>
				</PageHeader>
			</motion.div>

			<motion.div
				variants={fadeUpItem}
				className="rounded-xl border border-border/70 overflow-hidden"
			>
				<TableProvider columns={columns} data={skins ?? []}>
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
				{(skins ?? []).length === 0 && (
					<div className="py-16 text-center">
						<p className="text-sm text-muted-foreground">
							暂无皮肤数据，点击右上角新建
						</p>
					</div>
				)}
			</motion.div>

			{/* 删除确认弹窗 */}
			<ConfirmDialog
				open={!!deleteTarget}
				onOpenChange={(open) => !open && setDeleteTarget(null)}
				title="确认删除"
				description={`确定要删除皮肤「${deleteTarget?.name}」吗？此操作不可撤销。`}
				confirmLabel="删除"
				onConfirm={handleDelete}
				loading={deleteMutation.isPending}
				variant="destructive"
			/>
		</motion.div>
	);
}
