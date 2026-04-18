import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'

export const Route = createFileRoute('/user/map')({
  component: MapPage,
})

function MapPage() {
  return (
    <motion.div
      className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-[1.25rem] border border-border/70 bg-card shadow-[0_16px_40px_-28px_oklch(0.18_0.025_195_/_0.18)]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <iframe
        src="/plugins/map"
        className="h-full w-full border-0"
        title="服务器地图"
        allowFullScreen
      />
    </motion.div>
  )
}
