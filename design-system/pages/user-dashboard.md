# User Dashboard -- 页面设计覆盖

> 本文档定义 User 端 Dashboard 页面的设计规范，覆盖 MASTER.md 中的通用规则。
> 当本文件的规则与 MASTER.md 冲突时，以本文件为准。

---

## 1. 模式标识

- **data-mode**: `user` (默认，无需显式设置)
- **主色**: 蓝色系 `oklch(0.52 0.105 223.128)` (Light) / `oklch(0.45 0.085 224.283)` (Dark)
- **氛围**: 专业、高效、信任感

---

## 2. 色彩覆盖

### 2.1 主色强调

| 用途 | 色值 | 说明 |
|------|------|------|
| Primary 按钮 | `bg-primary text-primary-foreground` | 蓝色填充 + 白色文字 |
| Primary 边框 | `border-primary/50` hover `border-primary` | 轮廓按钮 |
| Active 状态 | `bg-primary/10` | 选中项背景 |
| Sidebar Active | `bg-sidebar-primary text-sidebar-primary-foreground` | 侧栏活跃项 |

### 2.2 状态色映射

| 状态 | MC 色彩 | 使用场景 |
|------|--------|---------|
| 成功 / 在线 | `mc-grass` | 状态指示灯、成功提示 |
| 信息 / 处理中 | `mc-diamond` | 加载提示、信息标签 |
| 警告 / 待处理 | `mc-gold` | 警告提示、待办事项 |
| 错误 / 离线 | `mc-nether` | 错误提示、危险操作 |

### 2.3 状态色 Badge 用法

```
bg-mc-grass/15 text-mc-grass border-mc-grass/30   -- 成功
bg-mc-diamond/15 text-mc-diamond border-mc-diamond/30 -- 信息
bg-mc-gold/15 text-mc-gold border-mc-gold/30       -- 警告
bg-mc-nether/15 text-mc-nether border-mc-nether/30 -- 错误
```

---

## 3. 布局规范

### 3.1 整体布局

```
+--------------------------------------------------+
|  Sidebar (w-64)  |  Main Content (flex-1)        |
|                   |                                |
|  Logo             |  Page Header (h-14 sticky)    |
|  Nav Items        |  +----------------------------+|
|                   |  | Content Area               ||
|                   |  |  max-w-5xl mx-auto         ||
|                   |  |  px-6 py-6                 ||
|                   |  |                            ||
+--------------------------------------------------+
```

### 3.2 网格系统

| 场景 | 列配置 | 间距 |
|------|--------|------|
| 统计卡片 | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` | `gap-4` |
| 功能模块 | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | `gap-6` |
| 双栏布局 | `grid-cols-1 lg:grid-cols-2` | `gap-6` |

### 3.3 内容区域

- 最大宽度: `max-w-5xl` (64rem)
- 内边距: `px-6 py-6`
- 响应式: 移动端 `px-4 py-4`

---

## 4. 卡片规范

### 4.1 统计卡片 (Stat Card)

```
rounded-xl border border-border bg-card
shadow-[0_1px_3px_0_oklch(from_var(--foreground)_l_c_h_/_0.04)]
hover:shadow-[elevation-hover]
transition-all duration-200
```

- 内边距: `p-6`
- 标题: `text-sm font-medium text-muted-foreground`
- 数值: `text-2xl font-heading font-semibold`
- 辅助: `text-xs text-muted-foreground mt-1`
- 图标: 使用 `icon-box-{mc-color}` + `w-10 h-10`

### 4.2 内容卡片

- 圆角: `rounded-xl`
- 边框: `border border-border`
- 背景: `bg-card`
- 内边距: `p-6`
- 标题: `text-lg font-heading font-medium`

### 4.3 卡片 Hover

使用 `cardHoverVariants` 预设:
- `y: -2` (微上浮)
- `shadow` 增强 (elevation 层级切换)
- `duration: 200ms`, `ease: [0.25, 0.46, 0.45, 0.94]`

---

## 5. 动画规范

### 5.1 页面入场

使用 `staggerContainer` + `fadeUpItem` 组合:
- 容器: `staggerChildren: 80ms`, `delayChildren: 50ms`
- 子项: `duration: 450ms`, `opacity: 0 -> 1`, `y: 16 -> 0`

### 5.2 交互反馈

| 交互 | 动画 | 预设 |
|------|------|------|
| 卡片悬浮 | y: -2 + shadow | `cardHoverVariants` |
| 图标放大 | scale: 1.1 | `iconScaleVariants` |
| 箭头滑动 | x: 4 | `arrowSlideVariants` |
| 装饰线 | opacity: 0 -> 1 | `decorationLineVariants` |

---

## 6. 侧栏 (Sidebar)

### 6.1 配色

- 背景: `var(--sidebar)` = Light `oklch(0.987)` / Dark `oklch(0.218)`
- 文字: `var(--sidebar-foreground)`
- Active 项: `var(--sidebar-primary)` / `var(--sidebar-primary-foreground)`
- Hover: `var(--sidebar-accent)` / `var(--sidebar-accent-foreground)`
- 边框: `var(--sidebar-border)`

### 6.2 导航项

- 内边距: `px-3 py-2 rounded-lg`
- 图标: `w-5 h-5 mr-3`
- 文字: `text-sm`
- Active: `bg-sidebar-primary text-sidebar-primary-foreground`
- Hover (非 Active): `bg-sidebar-accent text-sidebar-accent-foreground`

---

## 7. 表格规范

- 容器: `rounded-xl border border-border overflow-hidden`
- 表头: `bg-muted/50 text-sm font-medium text-muted-foreground`
- 单元格: `px-4 py-3 text-sm`
- 行 Hover: `hover:bg-muted/30 transition-colors duration-150`
- 分隔线: `border-b border-border`

---

## 8. 页面头部

- 高度: `h-14` (56px)
- 定位: `sticky top-0 z-30`
- 背景: 使用 `.glass` 或 `.nav-glass` 玻璃效果
- 标题: `text-lg font-heading font-medium`
- 面包屑: `text-sm text-muted-foreground`

---

## 9. 暗色模式特殊处理

| 元素 | Light | Dark 调整 |
|------|-------|----------|
| 统计卡片数值 | `text-foreground` | 可增加字重 `font-semibold` |
| 状态指示灯 | MC 色彩直接使用 | 增加 `ring-{mc-color}/30` 发光环 |
| 表格行 hover | `bg-muted/30` | `bg-muted/20` (减少对比) |
| 侧栏 active | `bg-sidebar-primary` | 确保与侧栏背景对比度 > 3:1 |
