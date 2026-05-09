import {
  FileText,
  Globe,
  Palette,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
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
    title: '社区入口集中',
    description:
      '公告、规则、工单与玩家中心统一在官网，减少群文件和游戏内指令之间来回切换。',
    accent: 'grass' as const,
  },
  {
    icon: Globe,
    title: '游戏档案联动',
    description:
      '网页端同步 Minecraft 档案、昵称和角色权限，让玩家身份在站内外保持一致。',
    accent: 'diamond' as const,
  },
  {
    icon: Palette,
    title: '装扮资产管理',
    description:
      '皮肤与披风有独立资源库、上传限制和预览流程，管理自己的形象更直观。',
    accent: 'gold' as const,
  },
  {
    icon: FileText,
    title: '问题闭环',
    description:
      '玩家可以提交工单，管理组按类型、优先级和回复记录追踪处理进度。',
    accent: 'nether' as const,
  },
  {
    icon: ShieldCheck,
    title: '统一认证',
    description:
      'SSO 登录承接站内控制台、管理员后台和初始化流程，避免多套账号状态。',
    accent: 'diamond' as const,
  },
  {
    icon: Sparkles,
    title: '长期维护',
    description:
      '服务器状态、公告计划和后台工具围绕长期运营设计，而不是一次性展示页。',
    accent: 'grass' as const,
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
      title="不只是入口页"
      subtitle="把玩家常用操作和管理流程放在真正能用的位置。"
    >
      <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <StaggerItem key={f.title}>
            <LandingCard accent={f.accent} className="flex h-full flex-col p-5">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-muted text-primary">
                <f.icon className="size-5" />
              </div>
              <h3 className="font-heading text-base font-semibold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
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
