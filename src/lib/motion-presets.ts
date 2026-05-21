/**
 * Motion 动画预设常量
 *
 * 集中定义可复用的 motion variants 和 transition 配置，
 * 供各组件引用以保持动画一致性。
 *
 * @see src/components/ui/page-transition.tsx 页面入场动画参考
 */

import type { Transition } from 'motion/react'

// ─── 通用过渡配置 ──────────────────────────────────────

/** 卡片悬浮上浮过渡 */
export const hoverLiftTransition: Transition = {
  type: 'tween',
  duration: 0.2,
  ease: [0.25, 0.46, 0.45, 0.94],
}

/** 子元素微动效过渡（图标缩放、箭头位移等） */
export const childMotionTransition: Transition = {
  type: 'tween',
  duration: 0.2,
  ease: [0.25, 0.46, 0.45, 0.94],
}

// ─── Hover 状态变体 ──────────────────────────────────────

/** 卡片上浮 + 阴影变体 */
export const cardHoverVariants = {
  rest: {
    y: 0,
    boxShadow:
      '0 1px 3px 0 oklch(from var(--foreground) l c h / 0.04), 0 1px 2px -1px oklch(from var(--foreground) l c h / 0.04)',
  },
  hover: {
    y: -2,
    boxShadow:
      '0 4px 6px -1px oklch(from var(--foreground) l c h / 0.06), 0 12px 24px -4px oklch(from var(--foreground) l c h / 0.04)',
  },
}

/** 图标放大变体 */
export const iconScaleVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.1 },
}

/** 图标轻微放大变体 */
export const iconScaleSmallVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
}

/** 箭头右移变体 */
export const arrowSlideVariants = {
  rest: { x: 0 },
  hover: { x: 4 },
}

/** 箭头小幅度右移变体 */
export const arrowSlideSmallVariants = {
  rest: { x: 0 },
  hover: { x: 2 },
}

/** 装饰线淡入变体 */
export const decorationLineVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1 },
}

// ─── Dashboard 页面级动画 ──────────────────────────────────

/** 交错容器 — 子元素逐个入场 */
export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

/** 淡入上浮项目 — 用于 Dashboard 各 section */
export const fadeUpItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

// ─── 官网滚动动画 ──────────────────────────────────────────

/** 滚动揭示容器 — 子元素逐个入场 */
export const scrollRevealContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

/** 滚动揭示子项 */
export const scrollRevealItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/** Hero 标题动画 */
export const heroTextVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/** 浮动装饰动画 */
export const floatVariants = {
  animate: {
    y: [-8, 8, -8],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const },
  },
}

/** 浮动装饰动画（慢速） */
export const floatSlowVariants = {
  animate: {
    y: [-12, 12, -12],
    x: [-4, 4, -4],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
}

/** 导航栏透明→实体 动画变体 (light) */
export const navVariants = {
  transparent: {
    backgroundColor: 'oklch(1 0 0 / 0)',
    backdropFilter: 'blur(0px)',
  },
  solid: {
    backgroundColor: 'oklch(1 0 0 / 80%)',
    backdropFilter: 'blur(12px)',
  },
}

/** 导航栏透明→实体 动画变体 (dark) */
export const navVariantsDark = {
  transparent: {
    backgroundColor: 'oklch(1 0 0 / 0)',
    backdropFilter: 'blur(0px)',
  },
  solid: {
    backgroundColor: 'oklch(0.148 0.004 228.8 / 80%)',
    backdropFilter: 'blur(12px)',
  },
}

// ─── Landing 官网动画 ────────────────────────────────────────

/** Landing Hero 入场动画 — title slide up, subtitle fade, CTA scale */
export const landingHeroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/** Landing 错落进入容器 */
export const landingStaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

/** Landing 单个错落项 — opacity + translateY */
export const landingStaggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/** Landing 慢速视差 */
export const landingParallaxSlow = {
  scroll: {
    y: [0, -30],
    transition: { duration: 0, ease: 'linear' as const },
  },
}

/** Landing 快速视差 */
export const landingParallaxFast = {
  scroll: {
    y: [0, -60],
    transition: { duration: 0, ease: 'linear' as const },
  },
}

/** Landing 卡片悬停 — y: -8, scale: 1.02, shadow */
export const landingCardHover = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 1px 3px 0 oklch(from var(--foreground) l c h / 0.04)',
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow:
      '0 8px 30px -4px oklch(0.53 0.12 130 / 15%), 0 4px 6px -1px oklch(0.53 0.12 130 / 10%)',
  },
}

/** Landing 光晕脉动 */
export const landingGlowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px oklch(0.53 0.12 130 / 15%)',
      '0 0 40px oklch(0.53 0.12 130 / 25%)',
      '0 0 20px oklch(0.53 0.12 130 / 15%)',
    ],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
  },
}

/** Landing 通用淡入上移 */
export const landingFadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

// ─── MC 风格动画预设 (user / admin) ──────────────────────────

/** MC 卡片悬浮 — 微弱上浮 + 阴影增强 + MC 配色微弱发光 */
export const mcCardHover = {
  rest: {
    y: 0,
    boxShadow:
      '0 1px 3px 0 oklch(from var(--foreground) l c h / 0.04), 0 1px 2px -1px oklch(from var(--foreground) l c h / 0.04)',
  },
  hover: {
    y: -2,
    boxShadow:
      '0 4px 6px -1px oklch(from var(--foreground) l c h / 0.06), 0 12px 24px -4px oklch(0.53 0.12 130 / 8%), 0 4px 6px -1px oklch(from var(--foreground) l c h / 0.04)',
  },
}

/** MC 网格交错容器 — 子元素逐个淡入 */
export const mcStaggerGrid = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

/** MC 网格交错子项 — 从下方滑入 */
export const mcStaggerGridItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/** MC 淡入上滑 — 增强版 fadeUpItem，适用于页面区块切换 */
export const mcFadeSlideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/** MC 脉冲发光 — 适用于服务器状态指示器，柔和 opacity + shadow 脉冲 */
export const mcPulseGlow = {
  animate: {
    boxShadow: [
      '0 0 8px oklch(0.53 0.12 130 / 10%)',
      '0 0 20px oklch(0.53 0.12 130 / 20%)',
      '0 0 8px oklch(0.53 0.12 130 / 10%)',
    ],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
  },
}
