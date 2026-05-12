/**
 * 成就类型引导提示组件
 * 根据选中的成就类型，展示对应的创建/编辑指引
 */

import { AchievementType } from '#/api/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Lightbulb } from 'lucide-react'

/** 类型引导数据 */
const TYPE_GUIDE_MAP: Record<
  number,
  {
    label: string
    badgeClass: string
    description: string
    conditionKeyHint: string
    conditionKeyExample: string
    thresholdRequired: boolean
    thresholdHint: string
    triggerMechanism: string
    tips: string[]
  }
> = {
  [AchievementType.Stat]: {
    label: '统计类',
    badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    description: '适用于需要累计达标的成就目标，系统会持续累加玩家的行为计数。',
    conditionKeyHint:
      '填写与 MC 插件事件对应的标识，后端通过此标识匹配并累加进度。',
    conditionKeyExample: 'mine_stone、kill_zombie、play_time',
    thresholdRequired: true,
    thresholdHint: '累计目标值。当玩家进度累加至该值时自动完成。',
    triggerMechanism: '自动累加：每次事件触发 progress += value',
    tips: [
      '条件键需与 Minecraft 插件中注册的事件标识完全一致',
      '阈值应为正整数，代表玩家需要累计达到的数量',
    ],
  },
  [AchievementType.Event]: {
    label: '事件类',
    badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    description: '适用于一次性事件成就，玩家触发对应事件后立即完成。',
    conditionKeyHint:
      '填写事件标识，后端在收到匹配事件时直接将成就标记为已完成。',
    conditionKeyExample: 'first_login、enter_the_end、kill_dragon',
    thresholdRequired: false,
    thresholdHint: '',
    triggerMechanism: '即时完成：事件触发后 progress 直接设为 1',
    tips: [
      '事件类成就不需要设置条件阈值',
      '适合"首次做某事"这类一次性目标',
    ],
  },
  [AchievementType.Special]: {
    label: '特殊条件',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    description:
      '适用于数值比较型目标，系统会直接比较传入值是否达到阈值（非累加）。',
    conditionKeyHint:
      '填写需要检测的数值维度标识，后端在收到事件时直接比较传入值。',
    conditionKeyExample: 'player_level、combat_power、balance',
    thresholdRequired: true,
    thresholdHint: '目标值。当传入值 >= 此值时自动完成。',
    triggerMechanism: '直接比较：value >= threshold 时完成',
    tips: [
      '与统计类不同，特殊条件不累加，而是直接比较当前值',
      '适用于等级、战力等可能上下浮动的数值指标',
    ],
  },
  [AchievementType.Manual]: {
    label: '管理员手动',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    description:
      '不参与自动触发，仅通过管理端手动授予给指定玩家。',
    conditionKeyHint:
      '仅作唯一标记，用于区分不同成就，无需与游戏事件对应。',
    conditionKeyExample: 'manual_contributor、manual_event_reward',
    thresholdRequired: false,
    thresholdHint: '',
    triggerMechanism: '手动授予：仅通过管理端 API 授予',
    tips: [
      '手动成就不会自动触发，适合运营活动奖励、特殊贡献等场景',
      '创建后可在成就详情页通过「授予成就」功能颁发给指定玩家',
    ],
  },
}

interface AchievementTypeGuideProps {
  selectedType: AchievementType
}

export function AchievementTypeGuide({
  selectedType,
}: AchievementTypeGuideProps) {
  const guide = TYPE_GUIDE_MAP[selectedType]

  if (!guide) return null

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          类型指引
          <Badge variant="secondary" className={guide.badgeClass}>
            {guide.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          {guide.description}
        </p>

        <div className="space-y-1.5">
          <h4 className="text-xs font-medium text-foreground">
            条件键
          </h4>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            {guide.conditionKeyHint}
          </p>
          <p className="text-[11px] font-mono text-muted-foreground/80 bg-muted/50 rounded px-2 py-1">
            示例：{guide.conditionKeyExample}
          </p>
        </div>

        {guide.thresholdRequired && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-medium text-foreground">
              条件阈值
            </h4>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              {guide.thresholdHint}
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <h4 className="text-xs font-medium text-foreground">
            触发机制
          </h4>
          <p className="text-[12px] text-muted-foreground font-mono">
            {guide.triggerMechanism}
          </p>
        </div>

        <div className="space-y-1.5">
          <h4 className="text-xs font-medium text-foreground">
            注意事项
          </h4>
          <ul className="space-y-1">
              {guide.tips.map((tip) => (
                <li
                  key={tip}
                  className="text-[12px] text-muted-foreground leading-relaxed flex gap-1.5"
                >
                  <span className="shrink-0 text-muted-foreground/60">•</span>
                  <span>{tip}</span>
                </li>
              ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
