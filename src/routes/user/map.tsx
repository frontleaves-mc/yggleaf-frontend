import { createFileRoute } from '@tanstack/react-router'
import { Map } from 'lucide-react'
import { motion } from 'motion/react'
import { fadeUpItem, staggerContainer } from '#/lib/motion-presets'
import { McCard } from '#/components/shared/mc-card'
import { McSectionHeader } from '#/components/shared/mc-section-header'

export const Route = createFileRoute('/user/map')({
  component: MapPage,
})

function MapPage() {
  return (
    <motion.div
      className="flex flex-col gap-4"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUpItem}>
        <McSectionHeader
          title="服务器地图"
          description="实时查看服务器世界地图"
          icon={Map}
          variant="grass"
        />
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <McCard variant="solid" color="default" className="overflow-hidden p-0">
          <div className="-m-3.5 sm:-m-5 lg:-m-6 h-[calc(100svh-10rem)] sm:h-[calc(100svh-11rem)] lg:h-[calc(100svh-12rem)] overflow-hidden rounded-xl">
            <iframe
              src="https://game-map.frontleaves.com/?world=world"
              className="h-full w-full border-0"
              title="服务器地图"
              allowFullScreen
            />
          </div>
        </McCard>
      </motion.div>
    </motion.div>
  )
}
