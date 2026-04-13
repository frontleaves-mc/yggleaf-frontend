/**
 * 用户端 - 皮肤浏览页
 *
 * 只读网格展示可用皮肤，点击查看详情
 * 后续可接入 API 获取真实数据
 */

import { Shirt, Search, Grid3X3, List } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'

// ─── 占位数据（后续替换为 API 数据） ───────────────────

interface SkinItem {
  id: string
  name: string
  author: string
  thumbnail?: string
  tags: string[]
}

const MOCK_SKINS: SkinItem[] = [
  { id: '1', name: '钻石骑士', author: 'Steve', tags: ['PvP', '简约'] },
  { id: '2', name: '暗影刺客', author: 'Alex', tags: ['暗黑', '细节'] },
  { id: '3', name: '海洋之心', author: 'Notch', tags: ['水系', '渐变'] },
  { id: '4', name: '烈焰战士', author: 'Herobrine', tags: ['火焰', 'PvP'] },
  { id: '5', name: '森林守护者', author: 'Villager', tags: ['自然', '像素'] },
  { id: '6', name: '星空旅人', author: 'Enderman', tags: ['宇宙', '发光'] },
]

// ─── 页面组件 ─────────────────────────────────────────────

export default function SkinsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground display-title">皮肤库</h1>
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

      {/* 皮肤网格 */}
      <div className={
        viewMode === 'grid'
          ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          : "flex flex-col gap-3"
      }>
        {MOCK_SKINS.map((skin) => (
          <SkinCard key={skin.id} skin={skin} viewMode={viewMode} />
        ))}
      </div>
    </div>
  )
}

// ─── 皮肤卡片组件 ─────────────────────────────────────────

function SkinCard({ skin, viewMode }: { skin: SkinItem; viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <Card className="card-hover cursor-pointer">
        <CardContent className="flex items-center gap-4 p-4">
          <Avatar className="size-14 rounded-lg">
            <AvatarImage src={skin.thumbnail} alt={skin.name} />
            <AvatarFallback className="rounded-lg bg-[var(--diamond)]/10">
              <Shirt className="size-6 text-[var(--diamond-deep)]" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{skin.name}</h3>
            <p className="text-xs text-muted-foreground">作者: {skin.author}</p>
          </div>
          <div className="flex gap-1.5">
            {skin.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-hover cursor-pointer group overflow-hidden">
      <CardContent className="p-4">
        {/* 皮肤预览区 */}
        <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-[var(--diamond)]/5 to-[var(--diamond)]/10 mb-3 flex items-center justify-center relative overflow-hidden">
          <Avatar className="size-20 rounded-xl ring-2 ring-[var(--diamond)]/20 group-hover:ring-[var(--diamond)]/40 transition-all">
            <AvatarImage src={skin.thumbnail} alt={skin.name} />
            <AvatarFallback className="rounded-xl bg-[var(--diamond)]/10 text-2xl">
              <Shirt className="size-10 text-[var(--diamond-deep)]" />
            </AvatarFallback>
          </Avatar>
          {/* Hover 遮罩 */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg" />
        </div>

        {/* 信息 */}
        <h3 className="font-medium text-sm text-foreground truncate group-hover:text-[var(--diamond)] transition-colors">
          {skin.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{skin.author}</p>
      </CardContent>
    </Card>
  )
}
