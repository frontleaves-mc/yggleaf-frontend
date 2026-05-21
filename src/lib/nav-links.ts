/**
 * 共享导航链接常量
 * LandingNavbar 和 PublicNavbar 统一引用此数据源
 */

export interface NavLink {
  label: string
  to: string
}

export const NAV_LINKS: NavLink[] = [
  { label: '首页', to: '/' },
  { label: '关于', to: '/about' },
  { label: '公告', to: '/announcements' },
  { label: '社区规则', to: '/rules' },
]
