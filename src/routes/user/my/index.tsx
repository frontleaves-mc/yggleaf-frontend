/**
 * 用户端 - 我的资源页面
 *
 * 用户的个人资源管理中心，包含：
 * - 上传皮肤/披风
 * - 从游戏档案同步官方皮肤
 * - 管理已上传的资源
 */

import { useState, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Upload,
  Download,
  FolderOpen,
  Shirt,
  Flag,
  Gamepad2,
  UserCircle,
  CheckCircle2,
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

export const Route = createFileRoute('/user/my/')({
  component: MyPage,
})

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
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground font-display">
          我的
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          上传、同步和管理你的皮肤与披风资源
        </p>
      </div>

      {/* 标签页 */}
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
    </div>
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

  const handleFileSelect = useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }, [])

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
        <UploadZone
          accept=".png"
          label="皮肤"
          onFileSelect={handleFileSelect}
          previewUrl={previewUrl}
          aspectRatio="h-40"
        />

        <div className="space-y-2">
          <Label htmlFor="skin-name">皮肤名称</Label>
          <Input
            id="skin-name"
            placeholder="给你的皮肤起个名字"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>模型类型</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue placeholder="选择模型类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Classic (Steve)</SelectItem>
              <SelectItem value="2">Slim (Alex)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-3.5">
          <div className="space-y-0.5">
            <Label className="text-sm">公开皮肤</Label>
            <p className="text-[12px] text-muted-foreground">
              开启后所有用户均可使用此皮肤
            </p>
          </div>
          <Switch checked={isPublic} onCheckedChange={setIsPublic} />
        </div>

        <Button
          className="w-full bg-gradient-to-r from-primary to-primary text-white hover:opacity-90"
          disabled={!name || !previewUrl}
        >
          <Upload className="mr-2 size-4" />
          上传皮肤
        </Button>
      </CardContent>
    </Card>
  )
}

function CapeUploadCard() {
  const [name, setName] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>()

  const handleFileSelect = useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }, [])

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
        <UploadZone
          accept=".png"
          label="披风"
          onFileSelect={handleFileSelect}
          previewUrl={previewUrl}
          aspectRatio="h-32"
        />

        <div className="space-y-2">
          <Label htmlFor="cape-name">披风名称</Label>
          <Input
            id="cape-name"
            placeholder="给你的披风起个名字"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-3.5">
          <div className="space-y-0.5">
            <Label className="text-sm">公开披风</Label>
            <p className="text-[12px] text-muted-foreground">
              开启后所有用户均可使用此披风
            </p>
          </div>
          <Switch checked={isPublic} onCheckedChange={setIsPublic} />
        </div>

        <Button
          className="w-full bg-gradient-to-r from-primary to-primary text-white hover:opacity-90"
          disabled={!name || !previewUrl}
        >
          <Upload className="mr-2 size-4" />
          上传披风
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

  return (
    <div className="space-y-4">
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
