/**
 * Motion 动画预设常量
 *
 * 集中定义可复用的 motion variants 和 transition 配置，
 * 供各组件引用以保持动画一致性。
 *
 * @see src/components/ui/page-transition.tsx 页面入场动画参考
 */

import { type Transition } from 'motion/react'

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
  rest: { y: 0, boxShadow: '0px 0px 0px rgba(0,0,0,0)' },
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
