import {
  FileText,
  Globe,
  Palette,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'

import {
  StaggerContainer,
  StaggerItem,
} from '#/components/landing/landing-animate'
import { LandingSection } from '#/components/landing/landing-section'
import { cn } from '#/lib/utils'

// ─── Feature Data ──────────────────────────────────────

const accentGradient: Record<string, string> = {
  grass: 'from-mc-grass/15 to-mc-grass/5',
  diamond: 'from-mc-diamond/15 to-mc-diamond/5',
  nether: 'from-mc-nether/15 to-mc-nether/5',
  gold: 'from-mc-gold/15 to-mc-gold/5',
}

const accentText: Record<string, string> = {
  grass: 'text-mc-grass',
  diamond: 'text-mc-diamond',
  nether: 'text-mc-nether',
  gold: 'text-mc-gold',
}

const accentBar: Record<string, string> = {
  grass: 'bg-mc-grass',
  diamond: 'bg-mc-diamond',
  nether: 'bg-mc-nether',
  gold: 'bg-mc-gold',
}

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

function FeaturesSection() {
  return (
    <LandingSection
      id="features"
      title="不只是入口页"
      subtitle="把玩家常用操作和管理流程放在真正能用的位置。"
      variant="default"
    >
      <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, index) => (
          <StaggerItem key={f.title}>
            <FeatureCard
              icon={f.icon}
              title={f.title}
              description={f.description}
              accent={f.accent}
              index={index + 1}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </LandingSection>
  )
}

// ─── FeatureCard ────────────────────────────────────────

function FeatureCard({
  icon: Icon,
  title,
  description,
  accent,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  accent: string
  index: number
}) {
  return (
    <div
      className={cn(
        'group relative flex h-full gap-5 rounded-2xl border border-border/50 p-6',
        'bg-card/60 backdrop-blur-sm',
        'transition-all duration-300',
        'hover:border-primary/20 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5',
      )}
    >
      <div
        className={cn(
          'absolute left-0 top-6 bottom-6 w-[3px] rounded-full opacity-40 transition-opacity duration-300 group-hover:opacity-80',
          accentBar[accent],
        )}
      />

      <div
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-xl',
          'bg-gradient-to-br',
          accentGradient[accent],
        )}
      >
        <span
          className={cn('text-lg font-bold tabular-nums', accentText[accent])}
        >
          {String(index).padStart(2, '0')}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2.5">
          <Icon className={cn('size-4.5', accentText[accent])} />
          <h3 className="font-heading text-[15px] font-semibold tracking-tight text-foreground">
            {title}
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

export { FeaturesSection }
