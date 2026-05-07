import { Globe, Palette, Users } from 'lucide-react'
import { LandingCard } from '#/components/landing/landing-primitives'
import { LandingSection } from '#/components/landing/landing-section'
import {
  StaggerContainer,
  StaggerItem,
} from '#/components/landing/landing-animate'

// ─── Feature Data ──────────────────────────────────────

const features = [
  {
    icon: Users,
    title: '社区互动',
    description: '活跃的在线社区，玩家实时交流，定期举办各类活动与比赛。',
    accent: 'grass' as const,
  },
  {
    icon: Globe,
    title: '网页联动',
    description: '网页端管理皮肤、披风、账号信息，游戏内外无缝衔接。',
    accent: 'diamond' as const,
  },
  {
    icon: Palette,
    title: '个性装扮',
    description: '自定义皮肤上传、披风选择，打造独一无二的游戏形象。',
    accent: 'gold' as const,
  },
] as const

// ─── Component ─────────────────────────────────────────

/**
 * 平台特色区块 — 三列特性卡片网格
 *
 * - 移动端单列，桌面端三列响应式布局
 * - 每张卡片带 MC 风格 accent 色条 + 图标
 * - StaggerContainer 实现交错入场动画
 */
function FeaturesSection() {
  return (
    <LandingSection
      id="features"
      title="平台特色"
      subtitle="为玩家打造全方位的 Minecraft 体验"
    >
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <StaggerItem key={f.title}>
            <LandingCard accent={f.accent} className="p-6 h-full">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.description}
              </p>
            </LandingCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </LandingSection>
  )
}

export { FeaturesSection }
