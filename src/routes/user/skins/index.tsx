/**
 * 用户端 - 皮肤浏览页（MC 风格）
 *
 * 对接 API 获取公开皮肤列表
 */

import { createFileRoute } from '@tanstack/react-router'
import { Shirt, Search, Grid3X3, List } from 'lucide-react'
import { useState } from 'react'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { SkinPreview } from '#/components/user/skin-preview'
import { motion } from 'motion/react'
import {
  mcStaggerGrid,
  mcStaggerGridItem,
} from '#/lib/motion-presets'
import { useSkins } from '#/api/endpoints/api-auth/skin-library'
import { LoadingPage } from '#/components/public/loading-page'
import type { SkinLibrary } from '#/api/types'
import { PageHeader } from '#/components/public/page-header'
import { McCard } from '#/components/shared/mc-card'
import { McBadge } from '#/components/shared/mc-badge'

export const Route = createFileRoute('/user/skins/')({
  component: SkinsPage,
})

// ─── 页面组件 ─────────────────────────────────────────────

function SkinsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { data, isLoading } = useSkins({
    mode: 'market',
    page: 1,
    page_size: 50,
  })
  const skins = data?.items ?? []

  return (
    <motion.div
      className="space-y-6"
      variants={mcStaggerGrid}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={mcStaggerGridItem}>
        <PageHeader
          title="皮肤库"
          description="浏览并选择你喜欢的角色皮肤"
          icon={Shirt}
          variant="diamond"
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
          <Input placeholder="搜索皮肤..." className="pl-9 h-9" />
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
          {skins.map((skin) => (
            <SkinCard key={skin.id} skin={skin} viewMode={viewMode} />
          ))}
        </motion.div>
      )}

      {!isLoading && skins.length === 0 && (
        <motion.div variants={mcStaggerGridItem}>
          <McCard variant="glass" className="border-dashed">
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-muted/50">
                <Shirt className="size-7 text-muted-foreground/40" />
              </div>
              <h3 className="font-medium text-foreground">暂无皮肤</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                目前还没有公开的皮肤资源
              </p>
            </div>
          </McCard>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── 皮肤卡片组件 ─────────────────────────────────────────

function SkinCard({
  skin,
  viewMode,
}: {
  skin: SkinLibrary
  viewMode: 'grid' | 'list'
}) {
  if (viewMode === 'list') {
    return (
      <McCard variant="glass" color="grass" className="cursor-pointer overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <div className="size-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted/30">
            <SkinPreview skinUrl={skin.texture_url} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">
              {skin.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <McBadge variant="diamond" className="font-mono">
                {skin.model === 1 ? 'Classic' : 'Slim'}
              </McBadge>
              <McBadge variant={skin.is_public ? 'grass' : 'default'}>
                {skin.is_public ? '公开' : '私有'}
              </McBadge>
            </div>
          </div>
        </div>
      </McCard>
    )
  }

  return (
    <McCard variant="glass" color="grass" className="cursor-pointer overflow-hidden group">
      <div className="p-4">
        <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 mb-3 flex items-center justify-center relative overflow-hidden">
          <SkinPreview skinUrl={skin.texture_url} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg" />
        </div>

        <h3 className="font-medium text-sm text-foreground truncate group-hover:text-[var(--color-mc-grass)] transition-colors">
          {skin.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          <McBadge variant="diamond" className="font-mono text-[10px]">
            {skin.model === 1 ? 'Classic' : 'Slim'}
          </McBadge>
        </div>
      </div>
    </McCard>
  )
}
