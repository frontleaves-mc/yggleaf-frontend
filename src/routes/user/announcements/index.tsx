/**
 * 用户端 - 公告中心页
 *
 * 展示系统公告列表，支持类型筛选（全部/站内/全局）和分页
 * 复用公开公告 API，点击卡片跳转至公开公告详情页
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { usePublicAnnouncements } from "#/api/endpoints/api-mc/public-announcement";
import { AnnouncementType } from "#/api/types";
import { LoadingPage } from "#/components/public/loading-page";
import { UserPageLayout } from "#/components/public/user-page-layout";
import { Badge } from "#/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
import {
	cardHoverVariants,
	fadeUpItem,
	hoverLiftTransition,
	staggerContainer,
} from "#/lib/motion-presets";

export const Route = createFileRoute("/user/announcements/")({
	component: UserAnnouncementsPage,
});

// ─── 类型筛选 Tab 配置 ──────────────────────────────────────

const TYPE_TABS = [
	{ value: "all", label: "全部", typeFilter: undefined as number | undefined },
	{ value: "insite", label: "站内", typeFilter: AnnouncementType.InSite },
	{ value: "global", label: "全局", typeFilter: AnnouncementType.Global },
] as const;

/** 每页条数 */
const PAGE_SIZE = 10;

// ─── 类型 Badge 样式映射 ────────────────────────────────────

function TypeBadge({ type }: { type: number }) {
	return (
		<Badge
			variant="secondary"
			className={
				type === AnnouncementType.InSite
					? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
					: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
			}
		>
			{type === AnnouncementType.InSite ? "站内" : "全局"}
		</Badge>
	);
}

// ─── 公告卡片（内联，不抽离独立组件） ───────────────────────

function AnnouncementCard({
	id,
	title,
	content,
	type,
	published_at,
}: {
	id: string;
	title: string;
	content: string;
	type: number;
	published_at: string;
}) {
	const excerpt = content.length > 100 ? `${content.slice(0, 100)}…` : content;

	return (
		<motion.div variants={fadeUpItem}>
			<motion.div
				variants={cardHoverVariants}
				transition={hoverLiftTransition}
				initial="rest"
				whileHover="hover"
			>
				<Link
					to="/announcements/$id"
					params={{ id }}
					className="block rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/20"
				>
					<div className="flex items-start justify-between gap-3">
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2 mb-1.5">
								<TypeBadge type={type} />
								<h3 className="truncate text-sm font-semibold text-foreground">
									{title}
								</h3>
							</div>
							<p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
								{excerpt}
							</p>
						</div>
						<time className="shrink-0 text-xs text-muted-foreground whitespace-nowrap pt-0.5">
							{new Date(published_at).toLocaleDateString("zh-CN")}
						</time>
					</div>
				</Link>
			</motion.div>
		</motion.div>
	);
}

// ─── 页面组件 ──────────────────────────────────────────────

function UserAnnouncementsPage() {
	const [typeTab, setTypeTab] = useState<string>("all");
	const [page, setPage] = useState(1);

	// 当前 Tab 对应的 type 筛选值
	const activeTab = TYPE_TABS.find((t) => t.value === typeTab) ?? TYPE_TABS[0];

	const { data, isLoading } = usePublicAnnouncements({
		page,
		page_size: PAGE_SIZE,
		type: activeTab.typeFilter,
	});

	const list = data?.list ?? [];
	const total = data?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

	if (isLoading) return <LoadingPage />;

	return (
		<UserPageLayout title="公告中心" description="查看系统公告">
			{/* 类型筛选 Tab */}
			<motion.div variants={fadeUpItem}>
				<Tabs
					value={typeTab}
					onValueChange={(v) => {
						setTypeTab(v);
						setPage(1);
					}}
				>
					<TabsList className="h-8">
						{TYPE_TABS.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className="text-xs px-3 h-6"
							>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</motion.div>

			{/* 公告卡片列表 */}
			{list.length > 0 ? (
				<motion.div
					className="space-y-3"
					variants={staggerContainer}
					initial="initial"
					animate="animate"
				>
					{list.map((item) => (
						<AnnouncementCard
							key={item.id}
							id={item.id}
							title={item.title}
							content={item.content}
							type={item.type}
							published_at={item.published_at}
						/>
					))}
				</motion.div>
			) : (
				<motion.div variants={fadeUpItem}>
					<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
						<Megaphone className="mb-3 size-10 text-muted-foreground" />
						<p className="text-sm font-medium text-foreground">暂无公告</p>
						<p className="mt-1 text-sm text-muted-foreground">
							当前筛选条件下没有匹配的公告
						</p>
					</div>
				</motion.div>
			)}

			{/* 手动分页 */}
			{totalPages > 1 && (
				<motion.div
					variants={fadeUpItem}
					className="flex items-center justify-center gap-2"
				>
					<button
						type="button"
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={page <= 1}
						className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40"
					>
						上一页
					</button>
					<span className="text-xs text-muted-foreground tabular-nums">
						{page} / {totalPages}
					</span>
					<button
						type="button"
						onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						disabled={page >= totalPages}
						className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40"
					>
						下一页
					</button>
				</motion.div>
			)}
		</UserPageLayout>
	);
}
