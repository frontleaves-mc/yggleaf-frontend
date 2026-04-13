/**
 * 用户端 - 游戏档案列表页
 *
 * 显示当前用户关联的 Minecraft 游戏角色档案
 * 包含当前使用的皮肤和披风信息
 */

import { Gamepad2, Plus, Shirt, Flag, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'

// ─── 占位数据 ─────────────────────────────────────────────

interface GameProfile {
  id: string
  playerName: string
  uuid: string
  skinUrl?: string
  capeUrl?: string
  serverName: string
  lastActive: string
}

const MOCK_PROFILES: GameProfile[] = [
  {
    id: '1',
    playerName: 'xiaolfeng',
    uuid: 'xxxx-xxxx-xxxx-xxxx',
    skinUrl: undefined,
    capeUrl: undefined,
    serverName: 'Yggleaf Survival',
    lastActive: '刚刚',
  },
  {
    id: '2',
    playerName: 'Knight_Diamond',
    uuid: 'yyyy-yyyy-yyyy-yyyy',
    skinUrl: undefined,
    capeUrl: undefined,
    serverName: 'Yggleaf Creative',
    lastActive: '2 小时前',
  },
]

// ─── 页面组件 ─────────────────────────────────────────────

export default function ProfilesPage() {

  return (
    <div className="space-y-6">
      {/* 页面标题 + 操作 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">游戏档案</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            管理你的 Minecraft 角色档案
          </p>
        </div>
        <Button
          className="gap-1.5 shrink-0 bg-gradient-to-r from-primary to-primary text-white hover:opacity-90"
        >
          <Plus className="size-4" />
          绑定档案
        </Button>
      </div>

      {/* 档案列表 */}
      <div className="space-y-4">
        {MOCK_PROFILES.length > 0 ? (
          MOCK_PROFILES.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))
        ) : (
          /* 空状态 */
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Gamepad2 className="mx-auto size-12 text-muted-foreground/30" />
              <h3 className="mt-4 font-medium text-foreground">暂无游戏档案</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                绑定你的 Minecraft 角色以开始使用皮肤和披风
              </p>
              <Button className="mt-4 gap-1.5 bg-gradient-to-r from-primary to-primary text-white hover:opacity-90">
                <Plus className="size-4" />
                绑定第一个档案
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// ─── 档案卡片组件 ─────────────────────────────────────────

function ProfileCard({ profile }: { profile: GameProfile }) {
  return (
    <Card className="transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_6px_-1px_oklch(from_var(--foreground)_l_c_h_/_0.06),0_12px_24px_-4px_oklch(from_var(--foreground)_l_c_h_/_0.04)] overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* 头像 / 皮肤预览 */}
          <Avatar className="size-16 rounded-xl ring-2 ring-primary/15">
            <AvatarImage src={profile.skinUrl} alt={profile.playerName} />
            <AvatarFallback className="rounded-xl bg-primary/10 text-xl font-bold text-primary">
              {profile.playerName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* 信息 */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-lg">{profile.playerName}</h3>
              <Badge variant="secondary" className="text-xs">
                {profile.serverName}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground font-mono">
              UUID: {profile.uuid}
            </p>

            {/* 当前装备 */}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shirt className="size-3.5" />
                {profile.skinUrl ? '已设置皮肤' : '默认皮肤'}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Flag className="size-3.5" />
                {profile.capeUrl ? '已设置披风' : '无披风'}
              </div>
              <span className="text-xs text-muted-foreground ml-auto">
                最后活跃: {profile.lastActive}
              </span>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col gap-2 shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Shirt className="size-3.5" />
              更换皮肤
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
              <ExternalLink className="size-3.5" />
              详情
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
