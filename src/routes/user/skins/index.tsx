/**
 * 用户端 - 皮肤浏览页
 *
 * 对接 API 获取公开皮肤列表
 */

import { createFileRoute } from '@tanstack/react-router'
import { Shirt, Search, Grid3X3, List } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { motion } from 'motion/react'
import { cardHoverVariants, hoverLiftTransition } from '#/lib/motion-presets'
import { useSkins } from '#/api/endpoints/skin-library'
import { LoadingPage } from '#/components/public/loading-page'
import type { SkinLibrary } from '#/api/types'

export const Route = createFileRoute('/user/skins/')({
  component: SkinsPage,
})

// ─── 页面组件 ─────────────────────────────────────────────

export default function SkinsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { data, isLoading } = useSkins({ mode: 'market', page: 1, page_size: 50 })
  const skins = data?.items ?? []

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground font-display">皮肤库</h1>
        <p className="mt-1 text-sm text-muted-foreground">浏览并选择你喜欢的角色皮肤</p>
      </div>

      {/* 工具栏：搜索 + 视图切换 */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="搜索皮肤..." className="pl-9 h-9" />
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
      </div>

      {/* 加载态 */}
      {isLoading && <LoadingPage />}

      {/* 皮肤网格 */}
      {!isLoading && (
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            : "flex flex-col gap-3"
        }>
          {skins.map((skin) => (
            <SkinCard key={skin.id} skin={skin} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* 空状态 */}
      {!isLoading && skins.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Shirt className="mx-auto size-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-medium text-foreground">暂无皮肤</h3>
            <p className="mt-1 text-sm text-muted-foreground">目前还没有公开的皮肤资源</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ─── 皮肤卡片组件 ─────────────────────────────────────────

function SkinCard({ skin, viewMode }: { skin: SkinLibrary; viewMode: 'grid' | 'list' }) {
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
          <Avatar className="size-14 rounded-lg">
            <AvatarFallback className="rounded-lg bg-primary/10">
              <Shirt className="size-6 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{skin.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="font-mono text-xs">
                {skin.model === 1 ? 'Classic' : 'Slim'}
              </Badge>
              <Badge
                className={
                  skin.is_public
                    ? 'bg-chart-2/10 text-chart-2 border-chart-2/20 text-[10px]'
                    : 'text-[10px]'
                }
                variant="secondary"
              >
                {skin.is_public ? '公开' : '私有'}
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
        {/* 皮肤预览区 */}
        <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 mb-3 flex items-center justify-center relative overflow-hidden">
          <Avatar className="size-20 rounded-xl ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
            <AvatarFallback className="rounded-xl bg-primary/10 text-2xl">
              <Shirt className="size-10 text-primary" />
            </AvatarFallback>
          </Avatar>
          {/* Hover 遮罩 */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg" />
        </div>

        {/* 信息 */}
        <h3 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
          {skin.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          <Badge variant="secondary" className="font-mono text-[10px]">
            {skin.model === 1 ? 'Classic' : 'Slim'}
          </Badge>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  )
}
