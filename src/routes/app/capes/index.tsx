/**
 * 用户端 - 披风浏览页
 *
 * 结构同皮肤浏览页，展示可用披风
 */

import { Flag, Search, Grid3X3, List } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'

// ─── 占位数据 ─────────────────────────────────────────────

interface CapeItem {
  id: string
  name: string
  author: string
  thumbnail?: string
}

const MOCK_CAPES: CapeItem[] = [
  { id: '1', name: 'Mojang 经典披风', author: 'Mojang AB' },
  { id: '2', name: '龙翼披风', author: 'Ender Dragon' },
  { id: '3', name: '极地探险家', author: 'Snow Golem' },
  { id: '4', name: '火焰之翼', author: 'Blaze' },
  { id: '5', name: '深海潜行者', author: 'Guardian' },
  { id: '6', name: '幻翼披风', author: 'Phantom' },
]

// ─── 页面组件 ─────────────────────────────────────────────

export default function CapesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground display-title">披风库</h1>
        <p className="mt-1 text-sm text-muted-foreground">挑选属于你的独特披风</p>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center gap-3">
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
      </div>

      {/* 披风网格 */}
      <div className={
        viewMode === 'grid'
          ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          : "flex flex-col gap-3"
      }>
        {MOCK_CAPES.map((cape) => (
          <CapeCard key={cape.id} cape={cape} viewMode={viewMode} />
        ))}
      </div>
    </div>
  )
}

// ─── 披风卡片组件 ─────────────────────────────────────────

function CapeCard({ cape, viewMode }: { cape: CapeItem; viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <Card className="card-hover cursor-pointer">
        <CardContent className="flex items-center gap-4 p-4">
          <Avatar className="size-14 rounded-lg">
            <AvatarImage src={cape.thumbnail} alt={cape.name} />
            <AvatarFallback className="rounded-lg bg-[var(--gold)]/10">
              <Flag className="size-6 text-[oklch(0.75 0.12 75)]" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{cape.name}</h3>
            <p className="text-xs text-muted-foreground">作者: {cape.author}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-hover cursor-pointer group overflow-hidden">
      <CardContent className="p-4">
        {/* 披风预览区 — 竖长比例模拟披风 */}
        <div className="aspect-[2/3] rounded-lg bg-gradient-to-b from-[var(--gold)]/5 via-[var(--gold)]/8 to-[var(--gold)]/15 mb-3 flex items-center justify-center relative overflow-hidden">
          <Avatar className="size-16 rounded-lg ring-2 ring-[var(--gold)]/20 group-hover:ring-[var(--gold)]/40 transition-all">
            <AvatarImage src={cape.thumbnail} alt={cape.name} />
            <AvatarFallback className="rounded-lg bg-[var(--gold)]/10 text-xl">
              <Flag className="size-8 text-[oklch(0.75 0.12 75)]" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg" />
        </div>

        <h3 className="font-medium text-sm text-foreground truncate group-hover:text-[var(--gold)] transition-colors">
          {cape.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{cape.author}</p>
      </CardContent>
    </Card>
  )
}
