/**
 * 用户端 - 我的资源库页面
 *
 * 用户的个人资源管理中心，包含：
 * - 上传皮肤/披风
 * - 从游戏档案同步官方皮肤
 * - 管理已上传的资源
 */

import { useState, useCallback, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  Upload,
  Download,
  FolderOpen,
  Shirt,
  Flag,
  Gamepad2,
  UserCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Badge } from '#/components/ui/badge'
import { Switch } from '#/components/ui/switch'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { UploadZone } from '#/components/user/my/upload-zone'
import { ResourceGrid } from '#/components/user/my/resource-grid'
import { useCreateSkinMutation } from '#/api/endpoints/skin-library'
import { useCreateCapeMutation } from '#/api/endpoints/cape-library'
import { useLibraryQuota } from '#/api/endpoints/library-quota'
import { toast } from 'sonner'

export const Route = createFileRoute('/user/my/')({
  component: MyPage,
})

// ─── 工具函数 ─────────────────────────────────────────

/** 将 File 对象转换为携带 MIME 的 Base64 字符串（data:image/png;base64,XXXXX） */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ─── Mock 数据 ─────────────────────────────────────────

const MOCK_PROFILES = [
  {
    id: 1,
    name: 'Steve_Builder',
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    skinName: '经典 Steve',
    hasSkin: true,
  },
  {
    id: 2,
    name: 'Alex_Explorer',
    uuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    skinName: '经典 Alex',
    hasSkin: true,
  },
  {
    id: 3,
    name: 'NewPlayer',
    uuid: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    skinName: null,
    hasSkin: false,
  },
]

// ─── Stagger 入场动画常量 ──────────────────────────────

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

// ─── 页面组件 ───────────────────────────────────────────

export default function MyPage() {
  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      {/* 页面标题 */}
      <motion.div variants={fadeUpItem}>
        <h1 className="text-2xl font-bold text-foreground font-display">
          我的资源库
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          上传、同步和管理你的皮肤与披风资源
        </p>
      </motion.div>

      {/* 标签页 */}
      <motion.div variants={fadeUpItem}>
      <Tabs defaultValue="upload">
        <TabsList variant="line">
          <TabsTrigger value="upload">
            <Upload className="size-3.5" />
            上传资源
          </TabsTrigger>
          <TabsTrigger value="sync">
            <Download className="size-3.5" />
            官方同步
          </TabsTrigger>
          <TabsTrigger value="resources">
            <FolderOpen className="size-3.5" />
            我的资源
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <UploadSection />
        </TabsContent>

        <TabsContent value="sync" className="mt-6">
          <OfficialSyncSection />
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <MyResourcesSection />
        </TabsContent>
      </Tabs>
      </motion.div>
    </motion.div>
  )
}

// ─── 上传资源区 ─────────────────────────────────────────

function UploadSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkinUploadCard />
      <CapeUploadCard />
    </div>
  )
}

function SkinUploadCard() {
  const [name, setName] = useState('')
  const [model, setModel] = useState<string>('1')
  const [isPublic, setIsPublic] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>()
  const [base64Texture, setBase64Texture] = useState<string>('')
  const createMutation = useCreateSkinMutation()

  // 释放预览 URL 内存
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileSelect = useCallback(async (file: File) => {
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    try {
      const base64 = await fileToBase64(file)
      setBase64Texture(base64)
    } catch {
      toast.error('文件读取失败')
    }
  }, [])

  const handleUploadSkin = async () => {
    if (!name || !base64Texture) return
    try {
      await createMutation.mutateAsync({
        name,
        model: Number(model) as 1 | 2,
        texture: base64Texture,
        is_public: isPublic,
      })
      toast.success('皮肤上传成功')
      // 重置表单
      setName('')
      setModel('1')
      setIsPublic(false)
      setPreviewUrl(undefined)
      setBase64Texture('')
    } catch {
      toast.error('皮肤上传失败')
    }
  }

  return (
    <Card className="ring-0 border border-border/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Shirt className="size-4 text-primary" />
          </div>
          上传皮肤
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 左右布局：上传区域 + 表单 */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 左侧：上传区域 */}
          <div className="sm:w-48 shrink-0">
            <UploadZone
              accept=".png"
              label="皮肤"
              onFileSelect={handleFileSelect}
              previewUrl={previewUrl}
              aspectRatio="h-64"
            />
          </div>

          {/* 右侧：表单字段 */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="skin-name">皮肤名称</Label>
                <Input
                  id="skin-name"
                  placeholder="给你的皮肤起个名字"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={createMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label>模型类型</Label>
                <Select value={model} onValueChange={setModel} disabled={createMutation.isPending}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择模型类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Classic (Steve)</SelectItem>
                    <SelectItem value="2">Slim (Alex)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3.5">
              <div className="space-y-0.5">
                <Label className="text-sm">公开皮肤</Label>
                <p className="text-[12px] text-muted-foreground">
                  开启后所有用户均可使用此皮肤
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} disabled={createMutation.isPending} />
            </div>
          </div>
        </div>

        {/* 底部全宽上传按钮 */}
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-primary text-white hover:opacity-90"
          disabled={!name || !base64Texture || createMutation.isPending}
          onClick={handleUploadSkin}
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              上传中...
            </>
          ) : (
            <>
              <Upload className="mr-2 size-4" />
              上传皮肤
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

function CapeUploadCard() {
  const [name, setName] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>()
  const [base64Texture, setBase64Texture] = useState<string>('')
  const createMutation = useCreateCapeMutation()

  // 释放预览 URL 内存
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileSelect = useCallback(async (file: File) => {
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    try {
      const base64 = await fileToBase64(file)
      setBase64Texture(base64)
    } catch {
      toast.error('文件读取失败')
    }
  }, [])

  const handleUploadCape = async () => {
    if (!name || !base64Texture) return
    try {
      await createMutation.mutateAsync({
        name,
        texture: base64Texture,
        is_public: isPublic,
      })
      toast.success('披风上传成功')
      // 重置表单
      setName('')
      setIsPublic(false)
      setPreviewUrl(undefined)
      setBase64Texture('')
    } catch {
      toast.error('披风上传失败')
    }
  }

  return (
    <Card className="ring-0 border border-border/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Flag className="size-4 text-primary" />
          </div>
          上传披风
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 左右布局：上传区域 + 表单 */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 左侧：上传区域 */}
          <div className="sm:w-48 shrink-0">
            <UploadZone
              accept=".png"
              label="披风"
              onFileSelect={handleFileSelect}
              previewUrl={previewUrl}
              aspectRatio="h-64"
            />
          </div>

          {/* 右侧：表单字段 */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="cape-name">披风名称</Label>
                <Input
                  id="cape-name"
                  placeholder="给你的披风起个名字"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={createMutation.isPending}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3.5">
              <div className="space-y-0.5">
                <Label className="text-sm">公开披风</Label>
                <p className="text-[12px] text-muted-foreground">
                  开启后所有用户均可使用此披风
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} disabled={createMutation.isPending} />
            </div>
          </div>
        </div>

        {/* 底部全宽上传按钮 */}
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-primary text-white hover:opacity-90"
          disabled={!name || !base64Texture || createMutation.isPending}
          onClick={handleUploadCape}
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              上传中...
            </>
          ) : (
            <>
              <Upload className="mr-2 size-4" />
              上传披风
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

// ─── 官方同步区 ─────────────────────────────────────────

function OfficialSyncSection() {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('')
  const [synced, setSynced] = useState(false)

  const selectedProfile = MOCK_PROFILES.find(
    (p) => String(p.id) === selectedProfileId,
  )

  const handleSync = () => {
    // TODO: 实际同步逻辑
    setSynced(true)
    setTimeout(() => setSynced(false), 3000)
  }

  return (
    <Card className="ring-0 border border-border/70 max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Gamepad2 className="size-4 text-primary" />
          </div>
          同步官方皮肤
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>选择游戏档案</Label>
          <Select value={selectedProfileId} onValueChange={setSelectedProfileId}>
            <SelectTrigger>
              <SelectValue placeholder="选择一个游戏档案" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_PROFILES.map((profile) => (
                <SelectItem key={profile.id} value={String(profile.id)}>
                  {profile.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProfile && (
          <div className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-12 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary/10">
                  <UserCircle className="size-6 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">
                  {selectedProfile.name}
                </p>
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {selectedProfile.uuid}
                </p>
              </div>
            </div>

            {selectedProfile.hasSkin ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">当前皮肤:</span>
                <Badge variant="secondary">{selectedProfile.skinName}</Badge>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">当前皮肤:</span>
                <Badge variant="outline" className="text-muted-foreground">
                  未设置
                </Badge>
              </div>
            )}

            <Button
              className="w-full bg-gradient-to-r from-primary to-primary text-white hover:opacity-90"
              onClick={handleSync}
              disabled={synced}
            >
              {synced ? (
                <>
                  <CheckCircle2 className="mr-2 size-4" />
                  同步成功
                </>
              ) : (
                <>
                  <Download className="mr-2 size-4" />
                  从 Mojang 下载皮肤
                </>
              )}
            </Button>

            <p className="text-[12px] text-muted-foreground text-center">
              将尝试从 Mojang 服务器下载该角色当前使用的正版皮肤
            </p>
          </div>
        )}

        {!selectedProfile && (
          <div className="py-8 text-center">
            <Gamepad2 className="mx-auto size-10 text-muted-foreground/30" />
            <p className="mt-2 text-sm text-muted-foreground">
              选择一个游戏档案以同步皮肤
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── 我的资源区 ─────────────────────────────────────────

function MyResourcesSection() {
  const [resourceType, setResourceType] = useState<'skin' | 'cape'>('skin')
  const { data: quota, isLoading: quotaLoading } = useLibraryQuota()

  return (
    <div className="space-y-4">
      {/* 配额信息 */}
      {!quotaLoading && quota && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <QuotaCard
            icon={<Shirt className="size-3.5" />}
            label="皮肤 (公开)"
            used={quota.skins_public_used}
            total={quota.skins_public_total}
          />
          <QuotaCard
            icon={<Shirt className="size-3.5" />}
            label="皮肤 (私有)"
            used={quota.skins_private_used}
            total={quota.skins_private_total}
          />
          <QuotaCard
            icon={<Flag className="size-3.5" />}
            label="披风 (公开)"
            used={quota.capes_public_used}
            total={quota.capes_public_total}
          />
          <QuotaCard
            icon={<Flag className="size-3.5" />}
            label="披风 (私有)"
            used={quota.capes_private_used}
            total={quota.capes_private_total}
          />
        </div>
      )}

      {/* 配额骨架屏 */}
      {quotaLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="ring-0 border border-border/70">
              <CardContent className="p-3.5">
                <div className="h-3 w-16 rounded bg-muted/50 animate-pulse" />
                <div className="mt-2 h-2 w-full rounded-full bg-muted/50 animate-pulse" />
                <div className="mt-1.5 h-3 w-10 rounded bg-muted/50 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 类型切换 */}
      <div className="flex items-center gap-2">
        <Button
          variant={resourceType === 'skin' ? 'secondary' : 'ghost'}
          size="sm"
          className="gap-1.5"
          onClick={() => setResourceType('skin')}
        >
          <Shirt className="size-3.5" />
          皮肤
        </Button>
        <Button
          variant={resourceType === 'cape' ? 'secondary' : 'ghost'}
          size="sm"
          className="gap-1.5"
          onClick={() => setResourceType('cape')}
        >
          <Flag className="size-3.5" />
          披风
        </Button>
      </div>

      {/* 资源网格 */}
      <ResourceGrid type={resourceType} />
    </div>
  )
}

// ─── 配额卡片组件 ─────────────────────────────────────────

function QuotaCard({
  icon,
  label,
  used,
  total,
}: {
  icon: React.ReactNode
  label: string
  used: number
  total: number
}) {
  const pct = total > 0 ? Math.round((used / total) * 100) : 0
  const isFull = used >= total && total > 0

  return (
    <Card className="ring-0 border border-border/70">
      <CardContent className="p-3.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {icon}
          {label}
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${
              isFull
                ? 'bg-destructive'
                : pct > 80
                  ? 'bg-chart-4'
                  : 'bg-primary'
            }`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">
            {used} / {total}
          </span>
          {isFull && (
            <Badge variant="secondary" className="text-[10px] bg-destructive/10 text-destructive">
              已满
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
