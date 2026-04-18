/**
 * 菜单配置 + 面包屑映射
 *
 * 统一管理用户端和管理员端的导航菜单。
 * 类型导出供 Layout / SidebarMenuRenderer 使用。
 */

import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  Shirt,
  Flag,
  UserCircle,
  Settings,
  Store,
  MessageSquareWarning,
  Tags,
  Map,
} from 'lucide-react'

// ─── 类型定义 ────────────────────────────────────────────

export interface MenuItem {
  /** 唯一标识 */
  key: string
  /** 显示标签 */
  label: string
  /** 图标组件 */
  icon: LucideIcon
  /** 路由路径 */
  to?: string
  /** 子菜单 */
  children?: MenuItem[]
  /** 通知角标数量 */
  badge?: number | string
}

// ─── 管理后台菜单配置 ─────────────────────────────────────

export const adminMenuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: LayoutDashboard,
    to: '/admin',
  },
  {
    key: 'users',
    label: '用户管理',
    icon: Users,
    to: '/admin/users',
  },
  {
    key: 'game',
    label: '游戏',
    icon: Gamepad2,
    children: [
      {
        key: 'game-profiles',
        label: '游戏档案',
        icon: UserCircle,
        to: '/admin/game-profiles',
      },
    ],
  },
  {
    key: 'library',
    label: '资源库',
    icon: Shirt,
    children: [
      {
        key: 'skins',
        label: '皮肤库',
        icon: Shirt,
        to: '/admin/skins',
      },
      {
        key: 'capes',
        label: '披风库',
        icon: Flag,
        to: '/admin/capes',
      },
    ],
  },
  {
    key: 'issues',
    label: '问题管理',
    icon: MessageSquareWarning,
    children: [
      {
        key: 'issue-list',
        label: '问题列表',
        icon: MessageSquareWarning,
        to: '/admin/issues',
      },
      {
        key: 'issue-types',
        label: '问题类型',
        icon: Tags,
        to: '/admin/issue-types',
      },
    ],
  },
  {
    key: 'profile',
    label: '个人设置',
    icon: Settings,
    to: '/admin/profile',
  },
]

// ─── 用户端菜单配置 ───────────────────────────────────────

export const userMenuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: LayoutDashboard,
    to: '/user/dashboard',
  },
  {
    key: 'profiles',
    label: '游戏档案',
    icon: Gamepad2,
    to: '/user/profiles',
  },
  {
    key: 'market',
    label: '资源社区',
    icon: Store,
    children: [
      {
        key: 'skins',
        label: '皮肤库',
        icon: Shirt,
        to: '/user/skins',
      },
      {
        key: 'capes',
        label: '披风库',
        icon: Flag,
        to: '/user/capes',
      },
      {
        key: 'my',
        label: '我的资源库',
        icon: UserCircle,
        to: '/user/my',
      },
    ],
  },
  {
    key: 'issues',
    label: '问题反馈',
    icon: MessageSquareWarning,
    to: '/user/issues',
  },
  {
    key: 'map',
    label: '地图',
    icon: Map,
    to: '/user/map',
  },
  {
    key: 'profile',
    label: '个人中心',
    icon: Settings,
    to: '/user/profile',
  },
]

// ─── 面包屑标签映射（路由路径 → 显示名称） ─────────────────

export const breadcrumbLabels: Record<string, string> = {
  // ── 用户端 ──
  '/user': '用户中心',
  '/user/dashboard': '仪表盘',
  '/user/profiles': '游戏档案',
  '/user/skins': '皮肤库',
  '/user/capes': '披风库',
  '/user/issues': '问题反馈',
  '/user/map': '地图',
  '/user/issues/$issueId': '问题详情',
  '/user/profile': '个人中心',
  '/user/my': '我的资源库',
  '/setup': '账户设置',
  '/setup/password': '设置游戏密码',

  // ── 管理端 ──
  '/admin': '仪表盘',
  '/admin/users': '用户管理',
  '/admin/users/$userId': '用户详情',
  '/admin/game-profiles': '游戏档案',
  '/admin/game-profiles/$profileId': '档案详情',
  '/admin/skins': '皮肤库',
  '/admin/skins/create': '新建皮肤',
  '/admin/skins/$skinId': '编辑皮肤',
  '/admin/capes': '披风库',
  '/admin/capes/create': '新建披风',
  '/admin/capes/$capeId': '编辑披风',
  '/admin/issues': '问题管理',
  '/admin/issues/$issueId': '问题详情',
  '/admin/issue-types': '问题类型',
  '/admin/profile': '个人设置',
}
