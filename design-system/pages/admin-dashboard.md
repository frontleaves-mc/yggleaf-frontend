# Admin Dashboard -- 页面设计覆盖

> 本文档定义 Admin 端 Dashboard 页面的设计规范，覆盖 MASTER.md 中的通用规则。
> 当本文件的规则与 MASTER.md 冲突时，以本文件为准。

---

## 1. 模式标识

- **data-mode**: `admin` (设置在 Layout 的 SidebarProvider 上)
- **主色**: 红色系 `oklch(0.55 0.2 25)` (Light + Dark 统一)
- **氛围**: 权威、掌控、警示感

### 1.1 CSS 变量覆盖

```css
[data-mode='admin'] {
  --primary: oklch(0.55 0.2 25);
  --primary-foreground: oklch(0.984 0.019 200.873);
  --ring: oklch(0.55 0.15 25);
  --sidebar-primary: oklch(0.55 0.2 25);
  --sidebar-primary-foreground: oklch(0.984 0.019 200.873);
}
```

---

## 2. 色彩覆盖

### 2.1 主色强调

| 用途           | 色值                                                 | 说明                |
| -------------- | ---------------------------------------------------- | ------------------- |
| Primary 按钮   | `bg-primary text-primary-foreground`                 | 红色填充 + 浅色文字 |
| Primary 边框   | `border-primary/50` hover `border-primary`           | 轮廓按钮            |
| Active 状态    | `bg-primary/10`                                      | 选中项背景          |
| Sidebar Active | `bg-sidebar-primary text-sidebar-primary-foreground` | 侧栏活跃项          |
| Ring Focus     | `ring-[oklch(0.55_0.15_25)]`                         | 红色 Focus 环       |

### 2.2 Admin 特有状态色

| 状态      | 色彩                             | 与 User 端差异     |
| --------- | -------------------------------- | ------------------ |
| 危险操作  | `mc-nether` (主色本身就是红色系) | Primary 即为危险色 |
| 审核/待批 | `mc-gold`                        | 强调待处理         |
| 通过/正常 | `mc-grass`                       | 同 User 端         |
| 信息/查看 | `mc-diamond`                     | 同 User 端         |

### 2.3 操作色区分

由于 Admin 端主色为红色，需特别注意与 Nether (危险) 色的区分：

| 操作                  | 颜色                     | 规则                                                |
| --------------------- | ------------------------ | --------------------------------------------------- |
| 常规操作 (保存、编辑) | Primary (红色系)         | 使用 `bg-primary`                                   |
| 危险操作 (删除、清空) | `bg-destructive`         | 使用 shadcn destructive 变量，视觉上比 Primary 更深 |
| 确认按钮              | `bg-mc-grass text-white` | 使用绿色系，区别于红色主色                          |

---

## 3. 布局规范

### 3.1 整体布局

与 User Dashboard 相同的三栏结构:

```
+--------------------------------------------------+
|  Sidebar (w-64)  |  Main Content (flex-1)        |
|                   |                                |
|  Logo + Admin    |  Page Header (h-14 sticky)    |
|  Nav Items       |  +----------------------------+|
|                   |  | Content Area               ||
|  (管理菜单)       |  |  max-w-6xl mx-auto         ||
|                   |  |  px-6 py-6                 ||
+--------------------------------------------------+
```

**与 User 端差异**: Admin 内容区使用 `max-w-6xl` (72rem)，比 User 端更宽，承载更多数据。

### 3.2 网格系统

| 场景          | 列配置                                      | 间距        |
| ------------- | ------------------------------------------- | ----------- |
| 统计卡片      | `grid-cols-1 md:grid-cols-2 xl:grid-cols-4` | `gap-4`     |
| 数据表格 (宽) | `grid-cols-1`                               | --          |
| 双面板管理    | `grid-cols-1 lg:grid-cols-2`                | `gap-6`     |
| 审核列表      | `grid-cols-1`                               | `space-y-3` |

---

## 4. 卡片规范

### 4.1 统计卡片 (Stat Card)

与 User 端结构相同，但注意:

- 异常数值 (如错误数、封禁数): 使用 `text-mc-nether` 着色
- 正常数值: 使用 `text-foreground`
- 增长指标: 使用 `text-mc-grass` + 向上箭头
- 下降指标: 使用 `text-mc-nether` + 向下箭头

### 4.2 审核卡片

Admin 端特有的审核卡片:

```
rounded-xl border border-border bg-card p-6
border-l-4 border-l-mc-gold     -- 待审核
border-l-4 border-l-mc-grass    -- 已通过
border-l-4 border-l-mc-nether   -- 已拒绝
```

---

## 5. 动画规范

### 5.1 页面入场

与 User Dashboard 共享同一套入场动画:

- `staggerContainer` + `fadeUpItem`
- `staggerChildren: 80ms`, `delayChildren: 50ms`

### 5.2 交互反馈

与 User Dashboard 共享，额外增加:

| 交互     | 动画                                     | 说明           |
| -------- | ---------------------------------------- | -------------- |
| 删除确认 | `scale: 0.98` + 红色 ring                | 按下收缩反馈   |
| 审核操作 | 列表项淡出 `opacity: 1 -> 0, y: 0 -> -8` | 操作后移除动画 |
| 批量选择 | checkbox `scale: 1.2` then `scale: 1`    | 选中弹性效果   |

---

## 6. 侧栏 (Sidebar)

### 6.1 配色

与 User 端相同的 CSS 变量结构，但 `--sidebar-primary` 被覆盖为红色系。

### 6.2 导航项

- 结构同 User 端
- Active 项: 红色背景 + 浅色文字
- 可折叠子菜单: 使用 `space-y-1` 嵌套，缩进 `pl-9`

### 6.3 管理菜单分组

使用 `text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2` 作为分组标题。

---

## 7. 表格规范

Admin 端表格承载大量数据，需特殊优化:

- 容器: `rounded-xl border border-border overflow-x-auto`
- 表头: `bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide`
- 单元格: `px-4 py-3 text-sm whitespace-nowrap`
- 行 Hover: `hover:bg-primary/5 transition-colors duration-150` (使用红色低透明度)
- 紧凑模式: `px-3 py-2 text-xs` (数据密集时)
- 行选中: `bg-primary/10` (红色低透明度)
- 排序图标: `text-muted-foreground/50` hover `text-foreground`

---

## 8. 操作栏 (Action Bar)

Admin 端特有的批量操作栏:

```
sticky bottom-4 z-20
mx-4 rounded-xl border border-border bg-card
landing-glass-strong
p-3 flex items-center gap-3
shadow-lg
```

- 全选: `text-sm font-medium`
- 批量操作按钮: 使用对应状态的 MC 色彩
- 选中计数: `text-sm text-muted-foreground`

---

## 9. 表单规范

### 9.1 表单布局

- 标签: `text-sm font-medium text-foreground`
- 输入框: `h-9 rounded-lg border border-input bg-background`
- Focus: `ring-2 ring-ring ring-offset-2` (红色环)
- 错误状态: `border-mc-nether ring-mc-nether/20`

### 9.2 表单分组

- 分组标题: `text-sm font-medium text-foreground mb-3`
- 分组内容: `space-y-4`
- 分组间距: `space-y-8`

---

## 10. 暗色模式特殊处理

Admin 端红色主色在暗色模式中需要特别注意对比度:

| 元素         | 处理方式                                          |
| ------------ | ------------------------------------------------- |
| Primary 按钮 | 暗色下 Primary 红色与浅色文字对比度足够，无需调整 |
| 侧栏 Active  | 确保红色背景与侧栏暗色背景对比度 > 3:1            |
| 表格行 hover | 使用 `bg-primary/5` (极低透明度) 避免过亮         |
| 状态指示灯   | 增加 `ring-{color}/30` 发光环增强可辨识度         |
| 紧凑数据     | 暗色下可使用 `text-xs` 减少视觉密度               |

---

## 11. 权限标识

Admin 端特有的权限相关视觉提示:

| 元素       | 样式                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------- |
| 管理员标识 | `bg-mc-gold/15 text-mc-gold border-mc-gold/30 rounded-md px-2 py-0.5 text-xs font-medium` |
| 超级管理员 | 在管理员标识基础上增加 `ring-1 ring-mc-gold/50`                                           |
| 只读区域   | `opacity-60 pointer-events-none`                                                          |
| 调试模式   | `border-l-2 border-l-mc-diamond` 蓝色左边框标识                                           |
