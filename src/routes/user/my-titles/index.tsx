/**
 * 用户端 - 我的称号页
 *
 * 展示玩家拥有的称号卡片网格，支持装备/卸下操作
 */

import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  staggerContainer,
  fadeUpItem,
  cardHoverVariants,
  hoverLiftTransition,
} from '#/lib/motion-presets'
import { GameProfileSelector } from '#/components/public/game-profile-selector'
import { PageHeader } from '#/components/public/page-header'
import { LoadingPage } from '#/components/public/loading-page'
import { Card, CardContent } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Gamepad2, Award, ShieldOff } from 'lucide-react'
import { toast } from 'sonner'
import { useGameProfileStore } from '#/hooks/use-game-profile-store'
import {
  usePlayerTitles,
  useEquipTitleMutation,
  useUnequipTitleMutation,
  useEquippedTitle,
} from '#/api/endpoints/api-mc/player-title'
import { TitleType } from '#/api/types'
import type { PlayerTitleResponse } from '#/api/types'

export const Route = createFileRoute('/user/my-titles/')({
  component: MyTitlesPage,
})

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
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 页面标题 */}
      <motion.div variants={fadeUpItem}>
        <PageHeader
          title="我的称号"
          description="管理你的游戏称号，装备独特的称号来彰显个性"
        />
      </motion.div>

      {/* 游戏档案选择器 */}
      <motion.div variants={fadeUpItem}>
        <GameProfileSelector />
      </motion.div>

      {/* 内容区域 — 依状态分支渲染 */}
      {!uuid ? (
        <motion.div variants={fadeUpItem}>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Gamepad2 className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">请先选择游戏档案</p>
            </CardContent>
          </Card>
        </motion.div>
      ) : isLoading ? (
        <LoadingPage />
      ) : (
        <>
          {/* 当前装备的称号 */}
          <motion.div variants={fadeUpItem}>
            <Card
              className={equippedTitle ? 'border-primary/50 bg-primary/5' : ''}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">当前装备</p>
                    {equippedTitle ? (
                      <>
                        <p className="font-semibold text-foreground">
                          {equippedTitle.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {equippedTitle.description}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        未装备称号
                      </p>
                    )}
                  </div>
                </div>
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
                    <ShieldOff className="h-4 w-4 mr-1" />
                    卸下
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* 称号卡片网格 */}
          {titles && titles.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
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
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Award className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">暂无称号</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
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
  const typeLabel = (() => {
    switch (title.type) {
      case TitleType.General:
        return '通用'
      case TitleType.Group:
        return '权限组'
      case TitleType.Exclusive:
        return '专属'
      default:
        return '未知'
    }
  })()

  return (
    <motion.div variants={fadeUpItem}>
      <motion.div
        variants={cardHoverVariants}
        transition={hoverLiftTransition}
        initial="rest"
        whileHover="hover"
      >
        <Card className={isEquipped ? 'border-primary shadow-sm' : ''}>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm truncate">{title.name}</h3>
              {isEquipped && (
                <Badge variant="default" className="text-xs shrink-0">
                  已装备
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {title.description}
            </p>
            <div className="flex items-center justify-between pt-1">
              <Badge variant="secondary" className="text-xs">
                {typeLabel}
              </Badge>
              {!isEquipped && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onEquip}
                  disabled={isPending}
                  className="h-7 text-xs"
                >
                  装备
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
