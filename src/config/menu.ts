/**
 * 菜单配置 + 面包屑映射
 *
 * 统一管理用户端和管理员端的导航菜单。
 * 类型导出供 Layout / SidebarMenuRenderer 使用。
 */

import type { LucideIcon } from 'lucide-react'
import type { RoleName } from '#/api/types'
import {
  Activity,
  CalendarClock,
  Flag,
  Gamepad2,
  KeyRound,
  LayoutDashboard,
  Map,
  Megaphone,
  MessageCircle,
  MessageSquare,
  MessageSquareWarning,
  Puzzle,
  Server,
  Settings,
  Shirt,
  Store,
  Tags,
  Terminal,
  Trophy,
  UserCircle,
  Users,
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
  /** 允许访问的角色列表，不填则所有已认证管理员可见 */
  roles?: readonly RoleName[]
}

/** 菜单分组：将菜单项按功能模块归类，渲染为带标题的视觉分组 */
export interface MenuSection {
  /** 分组唯一标识 */
  key: string
  /** 分组标题（留空则不显示标题，用于无分组的顶层菜单项） */
  label?: string
  /** 该分组下的菜单项 */
  items: MenuItem[]
}

// ─── 管理后台菜单配置 ─────────────────────────────────────

export const adminMenuSections: MenuSection[] = [
  {
    key: 'default',
    items: [
      {
        key: 'dashboard',
        label: '仪表盘',
        icon: LayoutDashboard,
        to: '/admin/dashboard',
      },
    ],
  },
  {
    key: 'game',
    label: '游戏',
    items: [
      {
        key: 'game-profiles',
        label: '游戏档案',
        icon: UserCircle,
        to: '/admin/game-profiles',
      },
      {
        key: 'titles',
        label: '称号管理',
        icon: Tags,
        to: '/admin/titles',
        roles: ['SUPER_ADMIN'],
      },
      {
        key: 'achievements',
        label: '成就管理',
        icon: Trophy,
        to: '/admin/achievements',
        roles: ['SUPER_ADMIN'],
      },
    ],
  },
  {
    key: 'library',
    label: '资源库',
    items: [
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
    label: '社区',
    items: [
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
            roles: ['SUPER_ADMIN'],
          },
        ],
      },
      {
        key: 'announcement-system',
        label: '公告系统',
        icon: Megaphone,
        children: [
          {
            key: 'announcements',
            label: '公告管理',
            icon: Megaphone,
            to: '/admin/announcements',
          },
          {
            key: 'announcement-schedules',
            label: '调度管理',
            icon: CalendarClock,
            to: '/admin/announcement-schedules',
            roles: ['SUPER_ADMIN'],
          },
        ],
      },
    ],
  },
  {
    key: 'system',
    label: '系统',
    items: [
      {
        key: 'users',
        label: '用户管理',
        icon: Users,
        to: '/admin/users',
        roles: ['SUPER_ADMIN'],
      },
      {
        key: 'plugin',
        label: '插件管理',
        icon: Puzzle,
        roles: ['SUPER_ADMIN'],
        children: [
          {
            key: 'plugin-credentials',
            label: '插件凭证',
            icon: KeyRound,
            to: '/admin/plugin-credentials',
            roles: ['SUPER_ADMIN'],
          },
        ],
      },
      {
        key: 'servers',
        label: '服务器管理',
        icon: Server,
        to: '/admin/servers',
        roles: ['SUPER_ADMIN'],
      },
      {
        key: 'server-load',
        label: '服务器负载',
        icon: Activity,
        to: '/admin/server-load',
        roles: ['SUPER_ADMIN'],
      },
      {
        key: 'messages',
        label: '消息管理',
        icon: MessageSquare,
        children: [
          {
            key: 'admin-chat',
            label: '聊天记录',
            icon: MessageCircle,
            to: '/admin/messages/chat',
          },
          {
            key: 'admin-commands',
            label: '命令记录',
            icon: Terminal,
            to: '/admin/messages/commands',
          },
        ],
      },
    ],
  },
]

/** @deprecated 使用 adminMenuSections 替代 */
export const adminMenuItems: MenuItem[] = adminMenuSections.flatMap(
  (s) => s.items,
)

// ─── 用户端菜单配置 ───────────────────────────────────────

export const userMenuSections: MenuSection[] = [
  {
    key: 'default',
    items: [
      {
        key: 'dashboard',
        label: '仪表盘',
        icon: LayoutDashboard,
        to: '/user/dashboard',
      },
    ],
  },
  {
    key: 'game',
    label: '游戏',
    items: [
      {
        key: 'profiles',
        label: '游戏档案',
        icon: Gamepad2,
        to: '/user/profiles',
      },
      {
        key: 'game-info',
        label: '游戏信息',
        icon: Puzzle,
        to: '/user/game-info',
      },
      {
        key: 'map',
        label: '游戏地图',
        icon: Map,
        to: '/user/map',
      },
      {
        key: 'my-titles',
        label: '我的称号',
        icon: Tags,
        to: '/user/my-titles',
      },
      {
        key: 'chat',
        label: '游戏聊天',
        icon: MessageCircle,
        to: '/user/chat',
      },
      {
        key: 'commands',
        label: '命令记录',
        icon: Terminal,
        to: '/user/commands',
      },
    ],
  },
  {
    key: 'community',
    label: '社区',
    items: [
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
        key: 'profile',
        label: '个人中心',
        icon: Settings,
        to: '/user/profile',
      },
    ],
  },
]

/** @deprecated 使用 userMenuSections 替代 */
export const userMenuItems: MenuItem[] = userMenuSections.flatMap(
  (s) => s.items,
)

// ─── 面包屑标签映射（路由路径 → 显示名称） ─────────────────

export const breadcrumbLabels: Record<string, string> = {
  // ── 用户端 ──
  '/user': '用户中心',
  '/user/dashboard': '仪表盘',
  '/user/profiles': '游戏档案',
  '/user/skins': '皮肤库',
  '/user/capes': '披风库',
  '/user/game-info': '游戏信息',
  '/user/issues': '问题反馈',
  '/user/map': '游戏地图',
  '/user/issues/$issueId': '问题详情',
  '/user/profile': '个人中心',
  '/user/my': '我的资源库',
  '/user/my-titles': '我的称号',
  '/user/chat': '游戏聊天',
  '/user/commands': '命令记录',
  '/setup': '账户设置',
  '/setup/password': '设置游戏密码',

  // ── 管理端 ──
  '/admin/dashboard': '仪表盘',
  '/admin/users': '用户管理',
  '/admin/users/$userId': '用户详情',
  '/admin/game-profiles': '游戏档案管理',
  '/admin/game-profiles/$profileId': '档案详情',
  '/admin/skins': '皮肤库管理',
  '/admin/skins/create': '新建皮肤',
  '/admin/skins/$skinId': '编辑皮肤',
  '/admin/capes': '披风库管理',
  '/admin/capes/create': '新建披风',
  '/admin/capes/$capeId': '编辑披风',
  '/admin/issues': '问题管理',
  '/admin/issues/$issueId': '问题详情',
  '/admin/issue-types': '问题类型管理',
  '/admin/titles': '称号管理',
  '/admin/achievements': '成就管理',
  '/admin/achievements/create': '新建成就',
  '/admin/achievements/$achievementId': '编辑成就',
  '/admin/plugin-credentials': '插件凭证',
  '/admin/plugin-credentials/$credentialId': '凭证详情',
  '/admin/servers': '服务器管理',
  '/admin/server-load': '服务器负载',
  '/admin/messages/chat': '聊天记录',
  '/admin/messages/commands': '命令记录',

  // ── 公告 ──
  '/admin/announcements': '公告管理',
  '/admin/announcement-schedules': '调度管理',
  '/announcements': '公告中心',
  '/announcements/$id': '公告详情',
}
