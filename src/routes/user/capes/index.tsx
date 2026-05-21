/**
 * 用户端 - 披风浏览页（MC 风格）
 *
 * 对接 API 获取公开披风列表
 */

import { createFileRoute } from '@tanstack/react-router'
import { Flag, Search, Grid3X3, List } from 'lucide-react'
import { useState } from 'react'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { SkinPreview } from '#/components/user/skin-preview'
import { motion } from 'motion/react'
import {
  mcStaggerGrid,
  mcStaggerGridItem,
} from '#/lib/motion-presets'
import { useCapes } from '#/api/endpoints/api-auth/cape-library'
import { LoadingPage } from '#/components/public/loading-page'
import type { CapeLibrary } from '#/api/types'
import { PageHeader } from '#/components/public/page-header'
import { McCard } from '#/components/shared/mc-card'
import { McBadge } from '#/components/shared/mc-badge'

export const Route = createFileRoute('/user/capes/')({
  component: CapesPage,
})

// ─── 页面组件 ─────────────────────────────────────────────

export default function CapesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { data, isLoading } = useCapes({
    mode: 'market',
    page: 1,
    page_size: 50,
  })
  const capes = data?.items ?? []

  return (
    <motion.div
      className="space-y-6"
      variants={mcStaggerGrid}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={mcStaggerGridItem}>
        <PageHeader
          title="披风库"
          description="挑选属于你的独特披风"
          icon={Flag}
          variant="nether"
        >
          <div className="flex rounded-lg border border-border bg-muted/30">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon-sm"
              className="rounded-r-none"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="size-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon-sm"
              className="rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              <List className="size-4" />
            </Button>
          </div>
        </PageHeader>
      </motion.div>

      <motion.div variants={mcStaggerGridItem}>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="搜索披风..." className="pl-9 h-9" />
        </div>
      </motion.div>

      {isLoading && <LoadingPage />}

      {!isLoading && (
        <motion.div
          variants={mcStaggerGridItem}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'flex flex-col gap-3'
          }
        >
          {capes.map((cape) => (
            <CapeCard key={cape.id} cape={cape} viewMode={viewMode} />
          ))}
        </motion.div>
      )}

      {!isLoading && capes.length === 0 && (
        <motion.div variants={mcStaggerGridItem}>
          <McCard variant="glass" className="border-dashed">
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-muted/50">
                <Flag className="size-7 text-muted-foreground/40" />
              </div>
              <h3 className="font-medium text-foreground">暂无披风</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                目前还没有公开的披风资源
              </p>
            </div>
          </McCard>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── 披风卡片组件 ─────────────────────────────────────────

function CapeCard({
  cape,
  viewMode,
}: {
  cape: CapeLibrary
  viewMode: 'grid' | 'list'
}) {
  if (viewMode === 'list') {
    return (
      <McCard variant="glass" color="diamond" className="cursor-pointer overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <div className="size-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted/30">
            <SkinPreview capeUrl={cape.texture_url} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">
              {cape.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <McBadge variant={cape.is_public ? 'diamond' : 'default'}>
                {cape.is_public ? '公开' : '私有'}
              </McBadge>
            </div>
          </div>
        </div>
      </McCard>
    )
  }

  return (
    <McCard variant="glass" color="diamond" className="cursor-pointer overflow-hidden group">
      <div className="p-4">
        <div className="aspect-[2/3] rounded-lg bg-gradient-to-b from-chart-4/5 via-chart-4/8 to-chart-4/15 mb-3 flex items-center justify-center relative overflow-hidden">
          <SkinPreview capeUrl={cape.texture_url} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg" />
        </div>

        <h3 className="font-medium text-sm text-foreground truncate group-hover:text-[var(--color-mc-diamond)] transition-colors">
          {cape.name}
        </h3>
      </div>
    </McCard>
  )
}
