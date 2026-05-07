import type { ReactNode } from 'react'
import { PublicNavbar } from './navbar'
import { PublicFooter } from './footer'

interface PublicLayoutProps {
  children: ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <main className="pt-16">{children}</main>
      <PublicFooter />
    </div>
  )
}
