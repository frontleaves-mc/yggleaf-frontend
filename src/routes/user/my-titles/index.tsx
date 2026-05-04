/**
 * 用户端 - 我的称号页
 *
 * 展示玩家拥有的称号卡片网格，支持装备/卸下操作
 * 采用自定义卡片设计，无 shadcn Card 组件，避免多余间距注入
 * 使用 UserPageLayout 统一页面布局结构
 */

import { createFileRoute } from '@tanstack/react-router'
import {
  Award,
  Crown,
  Gamepad2,
  Gem,
  Shield,
  ShieldOff,
  Sparkles,
} from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import {
  useEquippedTitle,
  useEquipTitleMutation,
  usePlayerTitles,
  useUnequipTitleMutation,
} from '#/api/endpoints/api-mc/player-title'
import type { PlayerTitleResponse } from '#/api/types'
import { TitleType } from '#/api/types'
import { GameProfileSelector } from '#/components/public/game-profile-selector'
import { LoadingPage } from '#/components/public/loading-page'
import { UserPageLayout } from '#/components/public/user-page-layout'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { useGameProfileStore } from '#/hooks/use-game-profile-store'
import {
  cardHoverVariants,
  fadeUpItem,
  hoverLiftTransition,
  staggerContainer,
} from '#/lib/motion-presets'

export const Route = createFileRoute('/user/my-titles/')({
  component: MyTitlesPage,
})

// ─── 称号类型视觉配置 ─────────────────────────────────────

/** 各称号类型的视觉风格映射 */
const TITLE_TYPE_STYLES: Record<
  number,
  {
    label: string
    badgeVariant: 'secondary' | 'default' | 'outline'
    accentFrom: string
    accentTo: string
    iconBg: string
    iconColor: string
    glowColor: string
    bgGradient: string
  }
> = {
  [TitleType.General]: {
    label: '通用',
    badgeVariant: 'secondary',
    accentFrom: 'from-zinc-400',
    accentTo: 'to-zinc-500',
    iconBg: 'bg-zinc-100 dark:bg-zinc-800/60',
    iconColor: 'text-zinc-500',
    glowColor: 'shadow-zinc-200/50 dark:shadow-zinc-800/30',
    bgGradient: '',
  },
  [TitleType.Group]: {
    label: '权限组',
    badgeVariant: 'default',
    accentFrom: 'from-indigo-500',
    accentTo: 'to-blue-500',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',
    iconColor: 'text-indigo-500',
    glowColor: 'shadow-indigo-200/50 dark:shadow-indigo-900/30',
    bgGradient: '',
  },
  [TitleType.Exclusive]: {
    label: '专属',
    badgeVariant: 'outline',
    accentFrom: 'from-amber-400',
    accentTo: 'to-orange-500',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    iconColor: 'text-amber-500',
    glowColor: 'shadow-amber-200/50 dark:shadow-amber-900/30',
    bgGradient:
      'bg-gradient-to-br from-amber-500/[0.03] via-transparent to-orange-500/[0.03]',
  },
}

// ─── 页面组件 ─────────────────────────────────────────────

export default function MyTitlesPage() {
  const { selectedGameProfile } = useGameProfileStore()
  const uuid = selectedGameProfile?.uuid ?? null

  const { data: titles, isLoading: titlesLoading } = usePlayerTitles(uuid)
  const { data: equippedTitle, isLoading: equippedLoading } =
    useEquippedTitle(uuid)
  const equipMutation = useEquipTitleMutation(uuid ?? '')
  const unequipMutation = useUnequipTitleMutation(uuid ?? '')

  const isLoading = titlesLoading || equippedLoading

  return (
    <UserPageLayout
      title="我的称号"
      description="管理你的游戏称号，装备独特的称号来彰显个性"
      actions={<GameProfileSelector />}
    >
      {/* 内容区域 — 依状态分支渲染 */}
      {!uuid ? (
        <motion.div variants={fadeUpItem}>
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
            <Gamepad2 className="mb-3 size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">请先选择游戏档案</p>
          </div>
        </motion.div>
      ) : isLoading ? (
        <LoadingPage />
      ) : (
        <>
          {/* 当前装备的称号 — 横幅式展示 */}
          <motion.div variants={fadeUpItem}>
            <div
              className={`relative overflow-hidden rounded-xl border p-5 transition-colors ${
                equippedTitle
                  ? 'border-primary/30 bg-gradient-to-r from-primary/[0.04] via-primary/[0.02] to-transparent'
                  : 'border-dashed border-border bg-muted/30'
              }`}
            >
              {/* 装备状态下的装饰光晕 */}
              {equippedTitle && (
                <>
                  <div className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full bg-primary/10 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-4 -left-4 size-16 rounded-full bg-primary/8 blur-xl" />
                </>
              )}

              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {/* 图标区域 */}
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${
                      equippedTitle
                        ? 'bg-primary/10 ring-1 ring-primary/20'
                        : 'bg-muted'
                    }`}
                  >
                    {equippedTitle ? (
                      <Crown className="size-5 text-primary" />
                    ) : (
                      <Award className="size-5 text-muted-foreground/60" />
                    )}
                  </div>

                  {/* 文字信息 */}
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">
                      当前装备
                    </p>
                    {equippedTitle ? (
                      <>
                        <p className="mt-0.5 truncate font-semibold text-foreground">
                          {equippedTitle.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {equippedTitle.description}
                        </p>
                      </>
                    ) : (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        未装备称号
                      </p>
                    )}
                  </div>
                </div>

                {/* 卸下按钮 */}
                {equippedTitle && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      unequipMutation.mutate(undefined, {
                        onSuccess: () => toast.success('称号已卸下'),
                        onError: () => toast.error('卸下失败，请重试'),
                      })
                    }}
                    disabled={unequipMutation.isPending}
                  >
                    <ShieldOff data-icon="inline-start" className="size-4" />
                    卸下
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* 称号卡片网格 */}
          {titles && titles.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
              variants={staggerContainer}
            >
              {titles.map((title) => (
                <TitleCard
                  key={title.id}
                  title={title}
                  isEquipped={title.is_equipped}
                  onEquip={() => {
                    equipMutation.mutate(
                      { title_id: title.id },
                      {
                        onSuccess: () =>
                          toast.success(`已装备「${title.name}」`),
                        onError: () => toast.error('装备失败，请重试'),
                      },
                    )
                  }}
                  isPending={equipMutation.isPending}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div variants={fadeUpItem}>
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
                <Award className="mb-3 size-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">暂无称号</p>
              </div>
            </motion.div>
          )}
        </>
      )}
    </UserPageLayout>
  )
}

// ─── 称号卡片组件 ─────────────────────────────────────────

function TitleCard({
  title,
  isEquipped,
  onEquip,
  isPending,
}: {
  title: PlayerTitleResponse
  isEquipped: boolean
  onEquip: () => void
  isPending: boolean
}) {
  // 获取当前类型对应的视觉配置（兜底使用 General 样式）
  const style =
    TITLE_TYPE_STYLES[title.type] ?? TITLE_TYPE_STYLES[TitleType.General]

  // 根据类型选择图标
  const TypeIcon =
    title.type === TitleType.Exclusive
      ? Gem
      : title.type === TitleType.Group
        ? Shield
        : Award

  return (
    <motion.div variants={fadeUpItem}>
      <motion.div
        variants={cardHoverVariants}
        transition={hoverLiftTransition}
        initial="rest"
        whileHover="hover"
        className={`group relative overflow-hidden rounded-lg border bg-card transition-shadow ${
          isEquipped
            ? `border-primary/40 shadow-md ${style.glowColor} ring-1 ring-primary/10`
            : 'border-border shadow-sm hover:shadow-md'
        } ${style.bgGradient}`}
      >
        {/* 左侧类型强调条 */}
        <div
          className={`pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${style.accentFrom} ${style.accentTo}`}
        />

        {/* 已装备状态 — 角标皇冠 */}
        {isEquipped && (
          <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-background shadow-sm">
            <Crown className="size-3" />
          </div>
        )}

        {/* 卡片主体内容 */}
        <div className="flex flex-col gap-2.5 p-3.5 pt-3">
          {/* 头部：图标 + 名称 */}
          <div className="flex items-start gap-2.5">
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-md ${style.iconBg} transition-transform duration-200 group-hover:scale-110`}
            >
              <TypeIcon className={`size-4 ${style.iconColor}`} />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className="truncate text-sm font-semibold leading-tight text-foreground">
                {title.name}
              </h3>
            </div>
          </div>

          {/* 描述文字 */}
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {title.description}
          </p>

          {/* 底部：类型标签 + 操作按钮 */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <Badge variant={style.badgeVariant} className="text-[10px]">
              {title.type === TitleType.Exclusive && (
                <Sparkles data-icon="inline-start" className="mr-1 size-3" />
              )}
              {style.label}
            </Badge>

            {!isEquipped && (
              <Button
                size="sm"
                variant="outline"
                onClick={onEquip}
                disabled={isPending}
                className="h-7 gap-1 px-2.5 text-xs"
              >
                装备
              </Button>
            )}

            {isEquipped && (
              <span className="text-[10px] font-medium text-primary">
                使用中
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
