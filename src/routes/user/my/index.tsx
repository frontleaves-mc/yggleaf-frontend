/**
 * 用户端 - 我的资源库页面（MC 风格）
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
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
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
import { useCreateSkinMutation } from '#/api/endpoints/api-auth/skin-library'
import { useCreateCapeMutation } from '#/api/endpoints/api-auth/cape-library'
import { useLibraryQuota } from '#/api/endpoints/api-auth/library-quota'
import { toast } from 'sonner'
import {
  mcStaggerGrid,
  mcStaggerGridItem,
} from '#/lib/motion-presets'
import { PageHeader } from '#/components/public/page-header'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { McBadge } from '#/components/shared/mc-badge'

export const Route = createFileRoute('/user/my/')({
  component: MyPage,
})

// ─── 工具函数 ─────────────────────────────────────────

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

// ─── 页面组件 ───────────────────────────────────────────

export default function MyPage() {
  return (
    <motion.div
      className="space-y-6"
      variants={mcStaggerGrid}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={mcStaggerGridItem}>
        <PageHeader
          title="我的资源库"
          description="上传、同步和管理你的皮肤与披风资源"
          icon={FolderOpen}
        />
      </motion.div>

      <motion.div variants={mcStaggerGridItem}>
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
    <McCard variant="solid" color="grass">
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2.5 text-base font-semibold">
          <McIconBox variant="grass" size="sm">
            <Shirt />
          </McIconBox>
          上传皮肤
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="sm:w-48 shrink-0">
            <UploadZone
              accept=".png"
              label="皮肤"
              onFileSelect={handleFileSelect}
              previewUrl={previewUrl}
              aspectRatio="h-64"
            />
          </div>

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
                <Select
                  value={model}
                  onValueChange={setModel}
                  disabled={createMutation.isPending}
                >
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
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
                disabled={createMutation.isPending}
              />
            </div>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full"
          variant="gradient"
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
      </div>
    </McCard>
  )
}

function CapeUploadCard() {
  const [name, setName] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>()
  const [base64Texture, setBase64Texture] = useState<string>('')
  const createMutation = useCreateCapeMutation()

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
      setName('')
      setIsPublic(false)
      setPreviewUrl(undefined)
      setBase64Texture('')
    } catch {
      toast.error('披风上传失败')
    }
  }

  return (
    <McCard variant="solid" color="diamond">
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2.5 text-base font-semibold">
          <McIconBox variant="diamond" size="sm">
            <Flag />
          </McIconBox>
          上传披风
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="sm:w-48 shrink-0">
            <UploadZone
              accept=".png"
              label="披风"
              onFileSelect={handleFileSelect}
              previewUrl={previewUrl}
              aspectRatio="h-64"
            />
          </div>

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
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
                disabled={createMutation.isPending}
              />
            </div>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full"
          variant="gradient"
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
      </div>
    </McCard>
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
    setSynced(true)
    setTimeout(() => setSynced(false), 3000)
  }

  return (
    <McCard variant="solid" color="nether" className="max-w-lg">
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2.5 text-base font-semibold">
          <McIconBox variant="nether" size="sm">
            <Gamepad2 />
          </McIconBox>
          同步官方皮肤
        </div>

        <div className="space-y-2">
          <Label>选择游戏档案</Label>
          <Select
            value={selectedProfileId}
            onValueChange={setSelectedProfileId}
          >
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
                <AvatarFallback className="rounded-lg bg-muted/50">
                  <UserCircle className="size-6 text-muted-foreground" />
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
                <McBadge variant="grass">{selectedProfile.skinName}</McBadge>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">当前皮肤:</span>
                <McBadge variant="default">未设置</McBadge>
              </div>
            )}

            <Button
              className="w-full"
              variant="gradient"
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
                  <Download className="mr-2 size-4" />从 Mojang 下载皮肤
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
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-xl bg-muted/50">
              <Gamepad2 className="size-7 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground">
              选择一个游戏档案以同步皮肤
            </p>
          </div>
        )}
      </div>
    </McCard>
  )
}

// ─── 我的资源区 ─────────────────────────────────────────

function MyResourcesSection() {
  const [resourceType, setResourceType] = useState<'skin' | 'cape'>('skin')
  const { data: quota, isLoading: quotaLoading } = useLibraryQuota()

  return (
    <div className="space-y-4">
      {!quotaLoading && quota && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <QuotaCard
            icon={<Shirt className="size-3.5" />}
            label="皮肤 (公开)"
            used={quota.skins_public_used}
            total={quota.skins_public_total}
            color="grass"
          />
          <QuotaCard
            icon={<Shirt className="size-3.5" />}
            label="皮肤 (私有)"
            used={quota.skins_private_used}
            total={quota.skins_private_total}
            color="nether"
          />
          <QuotaCard
            icon={<Flag className="size-3.5" />}
            label="披风 (公开)"
            used={quota.capes_public_used}
            total={quota.capes_public_total}
            color="diamond"
          />
          <QuotaCard
            icon={<Flag className="size-3.5" />}
            label="披风 (私有)"
            used={quota.capes_private_used}
            total={quota.capes_private_total}
            color="gold"
          />
        </div>
      )}

      {quotaLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <McCard key={i} variant="glass" className="animate-pulse">
              <div className="p-3.5">
                <div className="h-3 w-16 rounded bg-muted/50" />
                <div className="mt-2 h-1.5 w-full rounded-full bg-muted/50" />
                <div className="mt-1.5 h-3 w-10 rounded bg-muted/50" />
              </div>
            </McCard>
          ))}
        </div>
      )}

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
  color,
}: {
  icon: React.ReactNode
  label: string
  used: number
  total: number
  color: 'grass' | 'diamond' | 'nether' | 'gold'
}) {
  const pct = total > 0 ? Math.round((used / total) * 100) : 0
  const isFull = used >= total && total > 0

  const barColorMap: Record<typeof color, string> = {
    grass: 'bg-[var(--color-mc-grass)]',
    diamond: 'bg-[var(--color-mc-diamond)]',
    nether: 'bg-[var(--color-mc-nether)]',
    gold: 'bg-[var(--color-mc-gold)]',
  }

  return (
    <McCard variant="glass" color={color}>
      <div className="p-3.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {icon}
          {label}
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${
              isFull ? 'bg-destructive' : pct > 80 ? 'bg-chart-4' : barColorMap[color]
            }`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">
            {used} / {total}
          </span>
          {isFull && (
            <McBadge variant="nether" className="text-[10px]">
              已满
            </McBadge>
          )}
        </div>
      </div>
    </McCard>
  )
}
