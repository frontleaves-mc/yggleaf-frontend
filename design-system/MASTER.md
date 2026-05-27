# YggLeaf MC Design System -- Master

> 本文档为 YggLeaf 项目的全局设计规范 (Source of Truth)。
> 页面级覆盖文档位于 `design-system/pages/` 目录，优先级高于本文件。

---

## 1. 色彩体系

### 1.1 模式主色 (Mode Primary)

项目通过 `data-mode` 属性切换三种模式，每种模式拥有独立主色：

| 模式        | CSS 选择器              | Light 主色                       | Dark 主色                        | 用途         |
| ----------- | ----------------------- | -------------------------------- | -------------------------------- | ------------ |
| User (默认) | `:root` / `.dark`       | `oklch(0.52 0.105 223.128)` 蓝色 | `oklch(0.45 0.085 224.283)` 蓝色 | 用户端主界面 |
| Admin       | `[data-mode='admin']`   | `oklch(0.55 0.2 25)` 红色        | `oklch(0.55 0.2 25)` 红色        | 管理端主界面 |
| Landing     | `[data-mode='landing']` | `oklch(0.49 0.115 146)` 绿色     | `oklch(0.62 0.13 146)` 绿色      | 官网页面     |

### 1.2 Minecraft 辅助色 (MC Accent Colors)

四色体系，贯穿全站的标志性色彩：

| 名称    | CSS 变量             | Hex 值    | oklch 近似值           | 语义                   |
| ------- | -------------------- | --------- | ---------------------- | ---------------------- |
| Grass   | `--color-mc-grass`   | `#53a331` | `oklch(0.53 0.15 130)` | 自然、生长、正向反馈   |
| Diamond | `--color-mc-diamond` | `#1e6ee9` | `oklch(0.55 0.18 250)` | 稀有、重要、信息       |
| Nether  | `--color-mc-nether`  | `#ff481b` | `oklch(0.6 0.22 25)`   | 警告、危险、破坏性操作 |
| Gold    | `--color-mc-gold`    | `#ffc42c` | `oklch(0.75 0.16 85)`  | 高亮、成就、优质内容   |

品牌辅助色：
| 名称 | CSS 变量 | Hex 值 | 用途 |
|------|---------|--------|------|
| Brand | `--color-mc-brand` | `#5b7c28` | 品牌标识、Logo |
| Dark | `--color-mc-dark` | `#1a1d24` | 深色基底 |

### 1.3 MC 辅助色用法

#### Icon Box (图标容器)

图标容器通过 `icon-box` 基类 + 色彩后缀实现：

| 变体                | Light 背景 / 文字                                     | Dark 背景 / 文字                                      |
| ------------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| `.icon-box-grass`   | `oklch(0.53 0.15 130 / 10%)` / `oklch(0.53 0.15 130)` | `oklch(0.53 0.15 130 / 15%)` / `oklch(0.63 0.15 130)` |
| `.icon-box-diamond` | `oklch(0.55 0.18 250 / 10%)` / `oklch(0.55 0.18 250)` | `oklch(0.55 0.18 250 / 15%)` / `oklch(0.65 0.18 250)` |
| `.icon-box-nether`  | `oklch(0.6 0.22 25 / 10%)` / `oklch(0.6 0.22 25)`     | `oklch(0.6 0.22 25 / 15%)` / `oklch(0.7 0.22 25)`     |
| `.icon-box-gold`    | `oklch(0.75 0.16 85 / 12%)` / `oklch(0.7 0.16 85)`    | `oklch(0.75 0.16 85 / 15%)` / `oklch(0.8 0.16 85)`    |

**规范**: 所有图标容器使用 `display: flex; align-items: center; justify-content: center; border-radius: var(--radius-lg)` (即 `calc(0.625rem * 0.8)`)。

#### Badge (标签)

标签使用 MC 色彩的 15% 透明度背景 + 30% 透明度边框：

```
bg-mc-{color}/15 text-mc-{color} border-mc-{color}/30
```

**规范**: 基础样式为 `rounded-md px-2.5 py-0.5 text-xs font-medium border shadow-sm`。

#### Card Accent Line (卡片顶部色带)

LandingCard 支持顶部 1px 色带：`h-1 w-full bg-mc-{color}`。
可选色带: grass / diamond / nether / gold / none。

### 1.4 语义色映射

| 语义        | User 端                      | Admin 端    | 说明               |
| ----------- | ---------------------------- | ----------- | ------------------ |
| Primary     | 蓝色系 (223.128)             | 红色系 (25) | 按钮、链接、活跃态 |
| Secondary   | `oklch(0.967 0.001 286.375)` | 同 User     | 次级按钮、标签     |
| Destructive | `oklch(0.577 0.245 27.325)`  | 同 User     | 危险操作           |
| Muted       | `oklch(0.963 0.002 197.1)`   | 同 User     | 禁用、占位文字     |
| Accent      | `oklch(0.963 0.002 197.1)`   | 同 User     | 悬浮高亮           |
| Border      | `oklch(0.925 0.005 214.3)`   | 同 User     | 边框               |
| Ring        | 蓝色系 / 红色系              | 红色系      | Focus 环           |

### 1.5 图表色 (Chart)

图表使用五级绿色渐变（统一全模式）：

| 变量        | oklch 值                     |
| ----------- | ---------------------------- |
| `--chart-1` | `oklch(0.845 0.143 164.978)` |
| `--chart-2` | `oklch(0.696 0.17 162.48)`   |
| `--chart-3` | `oklch(0.596 0.145 163.225)` |
| `--chart-4` | `oklch(0.508 0.118 165.612)` |
| `--chart-5` | `oklch(0.432 0.095 166.913)` |

---

## 2. 玻璃拟态规范 (Glassmorphism)

### 2.1 基础玻璃 (`.glass`)

| 属性            | Light                       | Dark                             |
| --------------- | --------------------------- | -------------------------------- |
| background      | `oklch(1 0 0 / 60%)`        | `oklch(0.218 0.008 223.9 / 60%)` |
| backdrop-filter | `blur(12px) saturate(180%)` | 同 Light                         |
| border          | 无内建边框                  | 无内建边框                       |

### 2.2 Landing 玻璃 (`.landing-glass`)

| 属性            | Light                          | Dark                          |
| --------------- | ------------------------------ | ----------------------------- |
| background      | `oklch(1 0 0 / 60%)`           | `oklch(0.22 0.014 238 / 45%)` |
| backdrop-filter | `blur(16px) saturate(180%)`    | 同 Light                      |
| border          | `1px solid oklch(1 0 0 / 15%)` | `1px solid oklch(1 0 0 / 8%)` |

### 2.3 Landing 强玻璃 (`.landing-glass-strong`)

| 属性            | Light                          | Dark                           |
| --------------- | ------------------------------ | ------------------------------ |
| background      | `oklch(1 0 0 / 80%)`           | `oklch(0.22 0.014 238 / 60%)`  |
| backdrop-filter | `blur(20px) saturate(200%)`    | 同 Light                       |
| border          | `1px solid oklch(1 0 0 / 20%)` | `1px solid oklch(1 0 0 / 12%)` |

**用途**: 玻璃拟态卡片 (LandingCard) 使用此变体。承载可交互内容时优先选择 strong 变体以增强对比度。

### 2.4 导航玻璃 (`.nav-glass`)

| 属性            | Light                                        | Dark                                         |
| --------------- | -------------------------------------------- | -------------------------------------------- |
| background      | `oklch(1 0 0 / 75%)`                         | `oklch(0.148 0.004 228.8 / 75%)`             |
| backdrop-filter | `blur(16px) saturate(180%)`                  | 同 Light                                     |
| border          | `border-bottom: 1px solid oklch(0 0 0 / 6%)` | `border-bottom: 1px solid oklch(1 0 0 / 8%)` |

### 2.5 玻璃卡片规范 (mc-glass / mc-card)

当创建 MC 风格卡片时，遵循以下规范：

1. 基底: 使用 `landing-glass-strong` 提供毛玻璃背景
2. 悬浮: 添加 `landing-glow-hover` 实现悬浮光晕效果
3. 圆角: 使用 `rounded-xl` (即 `calc(0.625rem * 1.4)`)
4. 过渡: `transition-all duration-300`
5. 溢出: `overflow-hidden` 确保子元素不突破圆角边界
6. 分组: `group/card` 供子元素联动

---

## 3. 排版体系

### 3.1 字体族

| 角色 | CSS 变量         | 字体                           | 用途                 |
| ---- | ---------------- | ------------------------------ | -------------------- |
| 正文 | `--font-sans`    | `Inter Variable, sans-serif`   | 全局正文、按钮、标签 |
| 标题 | `--font-heading` | `Figtree Variable, sans-serif` | 页面标题、Hero 文案  |

### 3.2 字号规范

| 层级    | Tailwind Class                         | 用途             |
| ------- | -------------------------------------- | ---------------- |
| Display | `text-4xl` / `text-5xl` (font-heading) | Hero 主标题      |
| H1      | `text-3xl` / `text-4xl` (font-heading) | 页面标题         |
| H2      | `text-2xl` / `text-3xl` (font-heading) | Section 标题     |
| H3      | `text-xl` (font-heading)               | 子标题           |
| Body    | `text-sm` / `text-base` (font-sans)    | 正文             |
| Caption | `text-xs` (font-sans)                  | 辅助说明、Badge  |
| Mono    | `font-mono`                            | 代码块、数据数值 |

---

## 4. 圆角体系

项目基于 `--radius: 0.625rem` (10px) 构建圆阶层级：

| 层级 | CSS 变量       | 计算值            | Tailwind      | 用途           |
| ---- | -------------- | ----------------- | ------------- | -------------- |
| sm   | `--radius-sm`  | `0.375rem` (6px)  | `rounded-sm`  | Badge、小元素  |
| md   | `--radius-md`  | `0.5rem` (8px)    | `rounded-md`  | 输入框、小卡片 |
| lg   | `--radius-lg`  | `0.625rem` (10px) | `rounded-lg`  | 按钮、图标容器 |
| xl   | `--radius-xl`  | `0.875rem` (14px) | `rounded-xl`  | 卡片、模态框   |
| 2xl  | `--radius-2xl` | `1.125rem` (18px) | `rounded-2xl` | 大型面板       |
| 3xl  | `--radius-3xl` | `1.375rem` (22px) | `rounded-3xl` | 特殊容器       |
| 4xl  | `--radius-4xl` | `1.625rem` (26px) | `rounded-4xl` | 装饰元素       |

---

## 5. 间距体系

使用 Tailwind 原生间距系统，以下为推荐标准：

### 5.1 组件内间距

| 场景           | 间距                            | Tailwind              |
| -------------- | ------------------------------- | --------------------- |
| 按钮 (default) | `h-10 px-6`                     | 垂直 10px / 水平 24px |
| 按钮 (lg)      | `h-12 px-8`                     | 垂直 12px / 水平 32px |
| 按钮 (sm)      | `h-8 px-4`                      | 垂直 8px / 水平 16px  |
| Badge          | `px-2.5 py-0.5`                 | 水平 10px / 垂直 2px  |
| 卡片内         | `p-6`                           | 24px 全方向           |
| Section        | `py-6 px-4` sm `px-6` lg `px-8` | 响应式内边距          |

### 5.2 布局间距

| 场景            | 间距                                        | 说明               |
| --------------- | ------------------------------------------- | ------------------ |
| 网格间隔        | `gap-4` / `gap-6`                           | 卡片网格           |
| 垂直列表        | `space-y-4`                                 | 同类元素列表       |
| Section 间距    | `space-y-16`                                | Landing Section 间 |
| Landing Section | `padding: 6rem 1.5rem` / `max-width: 80rem` | 官网页面标准       |
| 响应式容器      | `px-4 md:px-6 lg:px-8`                      | 通用响应式边距     |

---

## 6. 动画时序规范

### 6.1 基础原则

- 微交互 (hover/focus): **150-300ms**
- 入场动画: **300-600ms**
- 页面级动画: **600-900ms**
- 装饰循环: **3-10s**, easeInOut
- 禁止: 超过 500ms 的 UI 过渡
- 必须: 尊重 `prefers-reduced-motion`

### 6.2 缓动函数

| 名称       | 值                         | 用途                         |
| ---------- | -------------------------- | ---------------------------- |
| Standard   | `[0.22, 1, 0.36, 1]`       | 入场动画 (easeOutQuint 变体) |
| Hover Lift | `[0.25, 0.46, 0.45, 0.94]` | 卡片悬浮、图标缩放           |
| EaseInOut  | `easeInOut`                | 装饰循环动画                 |

### 6.3 动画预设参考 (motion-presets.ts)

| 预设名                   | duration     | 效果               | 用途           |
| ------------------------ | ------------ | ------------------ | -------------- |
| `hoverLiftTransition`    | 200ms        | tween + ease       | 卡片悬浮       |
| `childMotionTransition`  | 200ms        | tween + ease       | 子元素微动效   |
| `cardHoverVariants`      | 200ms        | y: -2 + shadow     | Dashboard 卡片 |
| `iconScaleVariants`      | 200ms        | scale: 1.1         | 图标放大       |
| `iconScaleSmallVariants` | 200ms        | scale: 1.05        | 图标轻微放大   |
| `arrowSlideVariants`     | 200ms        | x: 4               | 箭头右移       |
| `staggerContainer`       | stagger 80ms | 交错入场           | Dashboard 容器 |
| `fadeUpItem`             | 450ms        | opacity + y: 16    | Dashboard 项目 |
| `scrollRevealItem`       | 600ms        | opacity + y: 30    | 滚动揭示       |
| `heroTextVariants`       | 800ms        | opacity + y: 40    | Hero 标题      |
| `floatVariants`          | 6000ms       | y: [-8, 8]         | 浮动装饰       |
| `floatSlowVariants`      | 10000ms      | x+y 双轴           | 慢速浮动       |
| `landingHeroVariants`    | 900ms        | opacity + y: 50    | Landing Hero   |
| `landingStaggerItem`     | 500ms        | opacity + y: 24    | Landing 错落   |
| `landingCardHover`       | --           | y: -8, scale: 1.02 | Landing 卡片   |
| `landingGlowPulse`       | 3000ms       | boxShadow 脉动     | 光晕效果       |

### 6.4 CSS 关键帧动画

| 名称            | 用途                                    |
| --------------- | --------------------------------------- |
| `shimmer`       | 骨架屏闪烁 (background-position 移动)   |
| `fade-slide-in` | 通用淡入上滑 (opacity + translateY 2px) |

---

## 7. 阴影体系

### 7.1 Elevation 层级

| 层级              | 值                                                                                                                       | 用途         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------ |
| Rest              | `0 1px 3px 0 oklch(from var(--foreground) l c h / 0.04), 0 1px 2px -1px oklch(from var(--foreground) l c h / 0.04)`      | 默认卡片     |
| Hover (Dashboard) | `0 4px 6px -1px oklch(from var(--foreground) l c h / 0.06), 0 12px 24px -4px oklch(from var(--foreground) l c h / 0.04)` | 卡片悬浮     |
| Hover (Landing)   | `0 8px 30px -4px oklch(0.53 0.12 130 / 15%), 0 4px 6px -1px oklch(0.53 0.12 130 / 10%)`                                  | Landing 卡片 |

### 7.2 特效阴影

| 名称                  | 用途                                     |
| --------------------- | ---------------------------------------- |
| `.mc-glow`            | MC 光晕: 双层绿色+蓝色扩散阴影           |
| `.ring-glow`          | Focus 光环: 2px 蓝色扩散                 |
| `.section-glow`       | Section 分隔线: 渐变发光线               |
| `.landing-glow-hover` | 悬浮光晕: box-shadow + border-color 过渡 |

---

## 8. 背景与纹理

| 类名                   | 效果                       | 用途             |
| ---------------------- | -------------------------- | ---------------- |
| `.bg-noise`            | SVG fractalNoise 3% 透明度 | 细腻纹理背景     |
| `.dot-grid`            | 24px 间距点阵              | 信息展示背景     |
| `.mc-grid-pattern`     | 32px 方格线                | MC 风格网格背景  |
| `.landing-gradient`    | 135deg 绿->蓝渐变          | Landing CTA 背景 |
| `.mc-gradient-text`    | 绿->蓝文字渐变             | MC 风格标题      |
| `.gradient-text`       | 蓝->紫->蓝文字渐变         | 品牌标题         |
| `.landing-section-alt` | 交替浅色背景               | Section 分隔     |

---

## 9. 导航栏

导航栏使用 Motion 实现透明到实体的滚动过渡：

| 状态 | Light 背景                          | Dark 背景                                       |
| ---- | ----------------------------------- | ----------------------------------------------- |
| 透明 | `oklch(1 0 0 / 0)`                  | `oklch(1 0 0 / 0)`                              |
| 实体 | `oklch(1 0 0 / 80%)` + `blur(12px)` | `oklch(0.148 0.004 228.8 / 80%)` + `blur(12px)` |

使用 `.nav-glass` 工具类作为基础样式，配合 `navVariants` / `navVariantsDark` 实现动画。

---

## 10. 滚动条

自定义滚动条，保持视觉一致性：

- 宽度: 6px
- 轨道: 透明
- 滑块 (Light): `oklch(0.7 0.01 214 / 30%)` / hover `oklch(0.7 0.01 214 / 50%)`
- 滑块 (Dark): `oklch(0.5 0.01 214 / 30%)` / hover `oklch(0.5 0.01 214 / 50%)`
- 圆角: 9999px
- Firefox: `scrollbar-width: thin`

---

## 11. 暗色模式适配

暗色模式通过 `.dark` 类名切换，所有色彩必须提供 dark 变体。

### 11.1 暗色模式通用规则

- 背景: 明显加深，保持与前景的 4.5:1 对比度
- 边框: 使用白色低透明度 `oklch(1 0 0 / 8-10%)` 替代实色边框
- MC 色彩: 饱和度略提升，明度略提升以保持可辨识度
- 玻璃拟态: 透明度适当降低，避免与深色背景混淆
- 光晕: 不透明度适度提升以补偿深色背景的吸收

---

## 12. 组件规范速查

### 12.1 LandingButton

| 变体    | 样式                                                                                   |
| ------- | -------------------------------------------------------------------------------------- |
| hero    | `landing-gradient text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02]` |
| outline | `border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary`     |
| ghost   | `text-foreground/80 hover:text-foreground hover:bg-muted/50`                           |

通用: `transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`

### 12.2 LandingCard

基础: `rounded-xl border border-border bg-card landing-glass-strong landing-glow-hover transition-all duration-300 group/card overflow-hidden`

### 12.3 LandingBadge

基础: `rounded-md px-2.5 py-0.5 text-xs font-medium border shadow-sm` + 对应色彩变体

---

## 13. 反模式 (Anti-Patterns)

| 禁止                                  | 原因                            |
| ------------------------------------- | ------------------------------- |
| 使用 emoji 作为图标                   | 不专业，大小不一致              |
| 线性 ease 动画                        | 机械感，应使用 ease-out/ease-in |
| 超过 500ms UI 过渡                    | 拖沓感                          |
| 深色模式使用透明度极低的边框          | 不可见                          |
| Light 模式使用 `bg-white/10`          | 对比度不足                      |
| 卡片 hover 使用 layout shift 的 scale | 导致布局抖动                    |
| 交互元素缺少 cursor-pointer           | 降低可发现性                    |
| 循环动画用于非加载装饰                | 分散注意力                      |
| 忽略 prefers-reduced-motion           | 无障碍违规                      |
