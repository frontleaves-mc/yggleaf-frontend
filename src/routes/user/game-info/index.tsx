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
import { Card, CardContent } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { motion } from 'motion/react'
import { cardHoverVariants, hoverLiftTransition } from '#/lib/motion-presets'
import { useModsMetadata } from '#/api/endpoints/mods-metadata'
import { LoadingPage } from '#/components/public/loading-page'
import { toast } from 'sonner'
import type { ModFileMetadata } from '#/api/types'

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
        <h1 className="text-2xl font-bold text-foreground font-display">
          游戏信息
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          查看服务器支持的所有模组
        </p>
      </motion.div>

      {/* 元数据统计 */}
      {!isLoading && data && (
        <motion.div variants={fadeUpItem}>
          <div className="grid grid-cols-3 gap-4">
            <Card className="ring-0 border border-border/70">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">模组总数</p>
                  <p className="text-lg font-semibold text-foreground">
                    {data.total}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="ring-0 border border-border/70">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HardDrive className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">总大小</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatFileSize(totalSize)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="ring-0 border border-border/70">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">最后扫描</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatScannedAt(data.scanned_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
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
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Puzzle className="mx-auto size-12 text-muted-foreground/30" />
              <h3 className="mt-4 font-medium text-foreground">
                {searchQuery ? '未找到匹配的模组' : '暂无模组'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? '尝试其他关键词搜索'
                  : '服务器尚未安装任何模组'}
              </p>
            </CardContent>
          </Card>
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
      <motion.div
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
        transition={hoverLiftTransition}
        className="rounded-lg"
      >
        <Card className="ring-0 border border-border/70 overflow-hidden">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="size-10 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
              <Puzzle className="size-5 text-primary/70" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">
                {modName}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 truncate font-mono">
                {mod.name}
              </p>
            </div>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              {formatFileSize(mod.size)}
            </Badge>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <code className="text-[11px] text-muted-foreground font-mono hidden sm:inline">
                {truncateHash(mod.hash)}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={handleCopyHash}
              >
                {copied ? (
                  <Check className="size-3.5 text-chart-2" />
                ) : (
                  <Copy className="size-3.5 text-muted-foreground" />
                )}
              </Button>
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
      className="rounded-lg"
    >
      <Card className="ring-0 border border-border/70 overflow-hidden group">
        <CardContent className="p-4">
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
            <Badge variant="secondary" className="text-[10px]">
              {formatFileSize(mod.size)}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleCopyHash}
            >
              {copied ? (
                <Check className="size-3 text-chart-2" />
              ) : (
                <Copy className="size-3 text-muted-foreground" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
