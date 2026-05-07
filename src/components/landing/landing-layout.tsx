import { Outlet } from '@tanstack/react-router'

interface LandingLayoutProps {
  children?: React.ReactNode
}

/**
 * Landing 官网页面顶层布局包装器
 *
 * 设置 data-mode="landing" 让 Minecraft 主题 CSS 变量生效，
 * 提供 main 内容区并为 fixed navbar 预留 padding-top。
 */
function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div data-mode="landing" className="min-h-screen bg-background">
      <main className="pt-16">{children ?? <Outlet />}</main>
    </div>
  )
}

export { LandingLayout }
