/**
 * 用户端 - 披风浏览页
 *
 * 对接 API 获取公开披风列表
 */

import { createFileRoute } from '@tanstack/react-router'
import { Flag, Search, Grid3X3, List } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { SkinPreview } from '#/components/user/skin-preview'
import { motion } from 'motion/react'
import { cardHoverVariants, hoverLiftTransition } from '#/lib/motion-presets'
import { useCapes } from '#/api/endpoints/cape-library'
import { LoadingPage } from '#/components/public/loading-page'
import type { CapeLibrary } from '#/api/types'

export const Route = createFileRoute('/user/capes/')({
  component: CapesPage,
})

// ─── Stagger 入场动画常量 ──────────────────────────────────

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const fadeUpItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

// ─── 页面组件 ─────────────────────────────────────────────

export default function CapesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { data, isLoading } = useCapes({ mode: 'market', page: 1, page_size: 50 })
  const capes = data?.items ?? []

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      {/* 页面标题 */}
      <motion.div variants={fadeUpItem}>
        <h1 className="text-2xl font-bold text-foreground font-display">披风库</h1>
        <p className="mt-1 text-sm text-muted-foreground">挑选属于你的独特披风</p>
      </motion.div>

      {/* 工具栏 */}
      <motion.div variants={fadeUpItem} className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="搜索披风..." className="pl-9 h-9" />
        </div>
        <div className="flex rounded-md border border-input">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="rounded-r-none size-9"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="size-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="rounded-l-none size-9"
            onClick={() => setViewMode('list')}
          >
            <List className="size-4" />
          </Button>
        </div>
      </motion.div>

      {/* 加载态 */}
      {isLoading && <LoadingPage />}

      {/* 披风网格 */}
      {!isLoading && (
        <motion.div variants={fadeUpItem} className={
          viewMode === 'grid'
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            : "flex flex-col gap-3"
        }>
          {capes.map((cape) => (
            <CapeCard key={cape.id} cape={cape} viewMode={viewMode} />
          ))}
        </motion.div>
      )}

      {/* 空状态 */}
      {!isLoading && capes.length === 0 && (
        <motion.div variants={fadeUpItem}>
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Flag className="mx-auto size-12 text-muted-foreground/30" />
              <h3 className="mt-4 font-medium text-foreground">暂无披风</h3>
              <p className="mt-1 text-sm text-muted-foreground">目前还没有公开的披风资源</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── 披风卡片组件 ─────────────────────────────────────────

function CapeCard({ cape, viewMode }: { cape: CapeLibrary; viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <motion.div
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
        transition={hoverLiftTransition}
        className="cursor-pointer rounded-lg"
      >
        <Card className="ring-0 border border-border/70 overflow-hidden">
          <CardContent className="flex items-center gap-4 p-4">
          <div className="size-14 rounded-lg overflow-hidden flex-shrink-0">
            <SkinPreview capeUrl={cape.texture_url} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{cape.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge
                className={
                  cape.is_public
                    ? 'bg-chart-2/10 text-chart-2 border-chart-2/20 text-[10px]'
                    : 'text-[10px]'
                }
                variant="secondary"
              >
                {cape.is_public ? '公开' : '私有'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
    )
  }

  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      transition={hoverLiftTransition}
      className="cursor-pointer rounded-lg"
    >
      <Card className="ring-0 border border-border/70 overflow-hidden group">
        <CardContent className="p-4">
        {/* 披风预览区 — 3D 渲染（搭配默认皮肤） */}
        <div className="aspect-[2/3] rounded-lg bg-gradient-to-b from-chart-4/5 via-chart-4/8 to-chart-4/15 mb-3 flex items-center justify-center relative overflow-hidden">
          <SkinPreview capeUrl={cape.texture_url} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg" />
        </div>

        <h3 className="font-medium text-sm text-foreground truncate group-hover:text-chart-4 transition-colors">
          {cape.name}
        </h3>
      </CardContent>
    </Card>
    </motion.div>
  )
}
