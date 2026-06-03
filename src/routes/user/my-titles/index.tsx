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
import { Button } from '#/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { useGameProfileStore } from '#/hooks/use-game-profile-store'
import { fadeUpItem, staggerContainer } from '#/lib/motion-presets'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { McBadge } from '#/components/shared/mc-badge'

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

// ─── 颜色辅助函数 ──────────────────────────────────────────

/** 从称号对象中提取自定义颜色，无 color 时返回 null */
function getTitleColor(title: { color?: string }): string | null {
  return title.color ?? null
}

// ─── 页面组件 ─────────────────────────────────────────────

function MyTitlesPage() {
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
      icon={Award}
      variant="gold"
      actions={<GameProfileSelector />}
    >
      {/* 内容区域 — 依状态分支渲染 */}
      {!uuid ? (
        <motion.div variants={fadeUpItem}>
          <McCard
            variant="glass"
            color="default"
            className="border-dashed py-12 text-center"
          >
            <McIconBox
              variant="diamond"
              size="lg"
              className="mx-auto mb-3 text-muted-foreground [&>svg]:text-muted-foreground"
            >
              <Gamepad2 />
            </McIconBox>
            <p className="text-sm text-muted-foreground">请先选择游戏档案</p>
          </McCard>
        </motion.div>
      ) : isLoading ? (
        <LoadingPage />
      ) : (
        <>
          {/* 当前装备的称号 — 横幅式展示 */}
          <motion.div variants={fadeUpItem}>
            {(() => {
              const eqColor = getTitleColor(equippedTitle ?? {})
              return (
                <McCard
                  variant="glass"
                  color={equippedTitle ? 'gold' : 'default'}
                  className={`transition-colors ${!equippedTitle ? 'border-dashed' : ''}`}
                >
                  <div className="flex items-center justify-between gap-4 p-5">
                    <div className="flex items-center gap-3.5">
                      {/* 图标区域 */}
                      {equippedTitle ? (
                        <McIconBox
                          variant="gold"
                          size="md"
                          style={
                            eqColor
                              ? { backgroundColor: `${eqColor}1A` }
                              : undefined
                          }
                        >
                          <Crown
                            style={eqColor ? { color: eqColor } : undefined}
                          />
                        </McIconBox>
                      ) : (
                        <McIconBox variant="grass" size="md">
                          <Award />
                        </McIconBox>
                      )}

                      {/* 文字信息 */}
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">
                          当前装备
                        </p>
                        {equippedTitle ? (
                          <>
                            <p
                              className="mt-0.5 truncate font-semibold text-foreground"
                              style={eqColor ? { color: eqColor } : undefined}
                            >
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
                        <ShieldOff
                          data-icon="inline-start"
                          className="size-4"
                        />
                        卸下
                      </Button>
                    )}
                  </div>
                </McCard>
              )
            })()}
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
              <McCard
                variant="glass"
                color="default"
                className="border-dashed py-12 text-center"
              >
                <McIconBox
                  variant="diamond"
                  size="lg"
                  className="mx-auto mb-3 text-muted-foreground [&>svg]:text-muted-foreground"
                >
                  <Award />
                </McIconBox>
                <p className="text-sm text-muted-foreground">暂无称号</p>
              </McCard>
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

  const titleColor = getTitleColor(title)

  // 根据类型选择图标
  const TypeIcon =
    title.type === TitleType.Exclusive
      ? Gem
      : title.type === TitleType.Group
        ? Shield
        : Award

  const mcColor =
    title.type === TitleType.Exclusive
      ? 'gold'
      : title.type === TitleType.Group
        ? 'diamond'
        : 'grass'
  const badgeVariant =
    title.type === TitleType.Exclusive
      ? ('gold' as const)
      : title.type === TitleType.Group
        ? ('diamond' as const)
        : ('grass' as const)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div variants={fadeUpItem}>
          <McCard
            variant="glass"
            color={isEquipped && !titleColor ? 'gold' : 'default'}
            className={`group overflow-hidden cursor-pointer transition-shadow ${
              isEquipped && !titleColor ? '' : ''
            }`}
            onClick={isEquipped || isPending ? undefined : onEquip}
            style={
              titleColor
                ? {
                    borderColor: `${titleColor}66`,
                    boxShadow: isEquipped
                      ? `0 0 12px ${titleColor}22`
                      : undefined,
                  }
                : undefined
            }
          >
            {/* 左侧类型强调条 */}
            {titleColor ? (
              <div
                className="pointer-events-none absolute left-0 top-0 h-full w-1"
                style={{
                  background: `linear-gradient(to bottom, ${titleColor}, ${titleColor}88)`,
                }}
              />
            ) : null}

            {/* 已装备状态 — 角标皇冠 */}
            {isEquipped && (
              <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-none bg-primary text-background mc-pixel-shadow-sm">
                <Crown className="size-3" />
              </div>
            )}

            {/* 卡片主体内容 */}
            <div className="flex flex-col gap-2 p-3.5 pt-3">
              {/* 头部：图标 + 名称 */}
              <div className="flex items-center gap-2.5">
                {titleColor ? (
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-none transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: `${titleColor}1A` }}
                  >
                    <TypeIcon
                      className="size-4"
                      style={{ color: titleColor }}
                    />
                  </div>
                ) : (
                  <McIconBox variant={mcColor} size="md">
                    <TypeIcon />
                  </McIconBox>
                )}
                <div className="min-w-0 flex-1">
                  <h3
                    className="truncate text-sm font-semibold leading-tight text-foreground"
                    style={titleColor ? { color: titleColor } : undefined}
                  >
                    {title.name}
                  </h3>
                </div>
              </div>

              {/* 底部：类型标签 + 状态 */}
              <div className="flex items-center gap-2">
                <McBadge variant={badgeVariant}>
                  {title.type === TitleType.Exclusive && (
                    <Sparkles
                      data-icon="inline-start"
                      className="mr-1 size-3"
                    />
                  )}
                  {style.label}
                </McBadge>

                {isEquipped && <McBadge variant="grass">使用中</McBadge>}
              </div>
            </div>
          </McCard>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="bottom">{title.description}</TooltipContent>
    </Tooltip>
  )
}
