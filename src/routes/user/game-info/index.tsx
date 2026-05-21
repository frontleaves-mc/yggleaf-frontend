/**
 * 用户端 - 游戏信息页面
 *
 * 展示服务器支持的所有模组列表，
 * 对接 GET /sync/mods/metadata 公开接口
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useCallback } from 'react'
import {
  Puzzle,
  Search,
  Grid3X3,
  List,
  Copy,
  Check,
  Clock,
  Package,
  HardDrive,
} from 'lucide-react'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { motion } from 'motion/react'
import { useModsMetadata } from '#/api/endpoints/api-auth/mods-metadata'
import { LoadingPage } from '#/components/public/loading-page'
import { toast } from 'sonner'
import type { ModFileMetadata } from '#/api/types'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { McBadge } from '#/components/shared/mc-badge'

export const Route = createFileRoute('/user/game-info/')({
  component: GameInfoPage,
})

// ─── 动画常量 ──────────────────────────────────────────────

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

// ─── 工具函数 ──────────────────────────────────────────────

/** 格式化文件大小 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/** 格式化扫描时间 */
function formatScannedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

/** 截断哈希值显示 */
function truncateHash(hash: string): string {
  if (hash.startsWith('sha256:')) {
    const hex = hash.slice(7)
    return `${hex.slice(0, 12)}...${hex.slice(-8)}`
  }
  if (hash.length > 20) {
    return `${hash.slice(0, 12)}...${hash.slice(-8)}`
  }
  return hash
}

/** 从文件名提取模组简称（去掉版本号和 .jar 后缀） */
function extractModName(filename: string): string {
  return filename
    .replace(/\.jar$/i, '')
    .replace(/-[\d].*$/, '')
    .replace(/[_-]/g, ' ')
}

// ─── 页面组件 ──────────────────────────────────────────────

export default function GameInfoPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const { data, isLoading } = useModsMetadata()

  const mods = data?.files ?? []
  const totalSize = useMemo(
    () => mods.reduce((sum, mod) => sum + mod.size, 0),
    [mods],
  )

  const filteredMods = useMemo(
    () =>
      searchQuery.trim()
        ? mods.filter((mod) =>
            mod.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : mods,
    [mods, searchQuery],
  )

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 页面标题 */}
      <motion.div variants={fadeUpItem}>
        <McSectionHeader
          title="游戏信息"
          description="查看服务器支持的所有模组"
          icon={Puzzle}
          variant="diamond"
        />
      </motion.div>

      {/* 元数据统计 */}
      {!isLoading && data && (
        <motion.div variants={fadeUpItem}>
          <div className="grid grid-cols-3 gap-4">
            <McCard variant="glass" color="grass" className="p-4 flex items-center gap-3">
              <McIconBox variant="grass" size="md">
                <Package />
              </McIconBox>
              <div>
                <p className="text-xs text-muted-foreground">模组总数</p>
                <p className="text-lg font-semibold text-foreground">
                  {data.total}
                </p>
              </div>
            </McCard>
            <McCard variant="glass" color="diamond" className="p-4 flex items-center gap-3">
              <McIconBox variant="diamond" size="md">
                <HardDrive />
              </McIconBox>
              <div>
                <p className="text-xs text-muted-foreground">总大小</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatFileSize(totalSize)}
                </p>
              </div>
            </McCard>
            <McCard variant="glass" color="gold" className="p-4 flex items-center gap-3">
              <McIconBox variant="gold" size="md">
                <Clock />
              </McIconBox>
              <div>
                <p className="text-xs text-muted-foreground">最后扫描</p>
                <p className="text-sm font-medium text-foreground">
                  {formatScannedAt(data.scanned_at)}
                </p>
              </div>
            </McCard>
          </div>
        </motion.div>
      )}

      {/* 工具栏：搜索 + 视图切换 */}
      <motion.div variants={fadeUpItem} className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="搜索模组..."
            className="pl-9 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex rounded-md border border-input">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon-lg"
            className="rounded-r-none"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="size-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon-lg"
            className="rounded-l-none"
            onClick={() => setViewMode('list')}
          >
            <List className="size-4" />
          </Button>
        </div>
      </motion.div>

      {/* 加载态 */}
      {isLoading && <LoadingPage />}

      {/* 模组列表 */}
      {!isLoading && (
        <motion.div
          variants={fadeUpItem}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'flex flex-col gap-3'
          }
        >
          {filteredMods.map((mod) => (
            <ModCard key={mod.path} mod={mod} viewMode={viewMode} />
          ))}
        </motion.div>
      )}

      {/* 空状态 */}
      {!isLoading && filteredMods.length === 0 && (
        <motion.div variants={fadeUpItem}>
          <McCard variant="glass" color="default" className="border-dashed py-12 text-center">
            <McIconBox variant="diamond" size="lg" className="mx-auto mb-4 text-muted-foreground/30 [&>svg]:text-muted-foreground/30">
              <Puzzle />
            </McIconBox>
            <h3 className="font-medium text-foreground">
              {searchQuery ? '未找到匹配的模组' : '暂无模组'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery ? '尝试其他关键词搜索' : '服务器尚未安装任何模组'}
            </p>
          </McCard>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── 模组卡片组件 ─────────────────────────────────────────

function ModCard({
  mod,
  viewMode,
}: {
  mod: ModFileMetadata
  viewMode: 'grid' | 'list'
}) {
  const [copied, setCopied] = useState(false)

  const handleCopyHash = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(mod.hash)
      setCopied(true)
      toast.success('哈希值已复制到剪贴板')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('复制失败，请手动复制')
    }
  }, [mod.hash])

  const modName = extractModName(mod.name)

  if (viewMode === 'list') {
    return (
      <McCard variant="glass" color="diamond" className="overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <McIconBox variant="diamond" size="md">
            <Puzzle />
          </McIconBox>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">
              {modName}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate font-mono">
              {mod.name}
            </p>
          </div>
          <McBadge variant="diamond">{formatFileSize(mod.size)}</McBadge>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <code className="text-[11px] text-muted-foreground font-mono hidden sm:inline">
              {truncateHash(mod.hash)}
            </code>
            <Button variant="ghost" size="icon-sm" onClick={handleCopyHash}>
              {copied ? (
                <Check className="size-3.5 text-chart-2" />
              ) : (
                <Copy className="size-3.5 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </McCard>
    )
  }

  return (
    <McCard variant="glass" color="diamond" className="group overflow-hidden">
      <div className="p-4">
        {/* 图标区 */}
        <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 mb-3 flex items-center justify-center">
          <Puzzle className="size-8 text-primary/50 group-hover:text-primary/70 transition-colors" />
        </div>

        {/* 模组信息 */}
        <h3 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
          {modName}
        </h3>
        <p className="text-[11px] text-muted-foreground truncate font-mono mt-0.5">
          {mod.name}
        </p>

        {/* 标签行 */}
        <div className="flex items-center justify-between mt-2">
          <McBadge variant="diamond">{formatFileSize(mod.size)}</McBadge>
          <Button
            variant="ghost"
            size="icon-xs"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCopyHash}
          >
            {copied ? (
              <Check className="size-3 text-chart-2" />
            ) : (
              <Copy className="size-3 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
    </McCard>
  )
}
