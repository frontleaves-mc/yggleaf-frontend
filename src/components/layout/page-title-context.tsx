/**
 * PageTitleContext - 允许子组件动态覆盖 TopBar 显示的标题
 * 用于详情页等需要显示具体数据标题（而非固定路由名称）的场景
 */

import { createContext, useContext, useState } from 'react'

interface PageTitleContextValue {
  title: string | null
  setTitle: (title: string | null) => void
}

const PageTitleContext = createContext<PageTitleContextValue>({
  title: null,
  setTitle: () => {},
})

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState<string | null>(null)

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  )
}

/** 在详情页等场景调用，设置 TopBar 显示的标题 */
export function useSetPageTitle() {
  return useContext(PageTitleContext).setTitle
}

/** 供 TopBar 读取覆盖后的标题 */
export function usePageTitleOverride() {
  return useContext(PageTitleContext).title
}
