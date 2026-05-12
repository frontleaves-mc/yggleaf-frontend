/**
 * 成就详情/编辑/授予页
 * 查看成就详情、编辑属性、授予玩家
 */

import {
  createFileRoute,
  Link,
  useNavigate,
} from '@tanstack/react-router'
import {
  useAdminAchievementDetail,
  useUpdateAchievementMutation,
  useDeleteAchievementMutation,
  useGrantAchievementMutation,
} from '#/api/endpoints/api-mc/admin-achievement'
import { useAdminTitles } from '#/api/endpoints/api-mc/admin-title'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Label } from '#/components/ui/label'
import { Switch } from '#/components/ui/switch'
import { Badge } from '#/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { ConfirmDialog } from '#/components/public/confirm-dialog'
import { LoadingPage } from '#/components/public/loading-page'
import { Loader2, ArrowLeft, Save, Trash2, Award } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { AchievementType } from '#/api/types'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'
import { useSetPageTitle } from '#/components/layout/page-title-context'
import { AchievementTypeGuide } from '#/components/public/achievement-type-guide'

export const Route = createFileRoute('/admin/achievements/$achievementId')({
  component: AchievementDetailPage,
})

function AchievementDetailPage() {
  const { achievementId } = Route.useParams()
  const navigate = useNavigate()
  const setTitle = useSetPageTitle()

  const { data: achievement, isLoading } = useAdminAchievementDetail(achievementId)
  const updateMutation = useUpdateAchievementMutation()
  const deleteMutation = useDeleteAchievementMutation()
  const grantMutation = useGrantAchievementMutation()
  const { data: titlesData } = useAdminTitles({ page_size: 100 })

  const titles = titlesData?.list ?? []

  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formType, setFormType] = useState<string>(String(AchievementType.Stat))
  const [formConditionKey, setFormConditionKey] = useState('')
  const [formThreshold, setFormThreshold] = useState('')
  const [formTitleId, setFormTitleId] = useState('')
  const [formSortOrder, setFormSortOrder] = useState('0')
  const [formIsActive, setFormIsActive] = useState(true)
  const [formInitialized, setFormInitialized] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [formPlayerUuid, setFormPlayerUuid] = useState('')

  if (achievement && !formInitialized) {
    setFormName(achievement.name)
    setFormDesc(achievement.description)
    setFormType(String(achievement.type))
    setFormConditionKey(achievement.condition_key)
    const cp = achievement.condition_params
    setFormThreshold(cp?.threshold != null ? String(cp.threshold) : '')
    const rc = achievement.reward_config
    setFormTitleId(rc?.title_id != null ? String(rc.title_id) : '')
    setFormSortOrder(String(achievement.sort_order))
    setFormIsActive(achievement.is_active)
    setFormInitialized(true)
    setTitle(achievement.name)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateMutation.mutateAsync({
        id: achievementId,
        data: {
          name: formName.trim(),
          description: formDesc.trim(),
          type: Number(formType) as AchievementType,
          condition_key: formConditionKey.trim(),
          condition_params: formThreshold ? { threshold: Number(formThreshold) } : undefined,
          reward_config: formTitleId && formTitleId !== '__none__' ? { title_id: formTitleId } : undefined,
          sort_order: formSortOrder ? Number(formSortOrder) : undefined,
          is_active: formIsActive,
        },
      })
      toast.success('成就更新成功')
      setFormInitialized(false)
    } catch {
      toast.error('更新失败')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(achievementId)
      toast.success('成就已删除')
      navigate({ to: '/admin/achievements' })
    } catch {
      toast.error('删除失败')
    }
  }

  const handleGrant = async () => {
    if (!formPlayerUuid.trim()) return
    try {
      await grantMutation.mutateAsync({
        id: achievementId,
        data: { player_uuid: formPlayerUuid.trim() },
      })
      toast.success('成就已授予')
      setFormPlayerUuid('')
    } catch {
      toast.error('授予失败，请检查玩家 UUID')
    }
  }

  if (isLoading) return <LoadingPage />

  if (!achievement) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        成就不存在
      </div>
    )
  }

  const selectedType = Number(formType) as AchievementType

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUpItem}>
        <Link
          to="/admin/achievements"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回成就列表
        </Link>
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 主表单 */}
          <Card className="max-w-xl lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">编辑成就</CardTitle>
                  <CardDescription>
                    修改成就 #{achievement.id.slice(0, 8)}... 的属性信息
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  ID: {achievement.id.slice(0, 8)}...
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">名称 *</Label>
                  <Input
                    id="edit-name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    maxLength={64}
                    disabled={updateMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-desc">描述 *</Label>
                  <Textarea
                    id="edit-desc"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    required
                    maxLength={255}
                    disabled={updateMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-type">类型 *</Label>
                  <Select value={formType} onValueChange={setFormType} disabled={updateMutation.isPending}>
                    <SelectTrigger id="edit-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={String(AchievementType.Stat)}>统计类</SelectItem>
                      <SelectItem value={String(AchievementType.Event)}>事件类</SelectItem>
                      <SelectItem value={String(AchievementType.Special)}>特殊条件</SelectItem>
                      <SelectItem value={String(AchievementType.Manual)}>管理员手动</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-key">条件键 *</Label>
                  <Input
                    id="edit-key"
                    value={formConditionKey}
                    onChange={(e) => setFormConditionKey(e.target.value)}
                    required
                    maxLength={64}
                    disabled={updateMutation.isPending}
                  />
                  {selectedType === AchievementType.Manual && (
                    <p className="text-[12px] text-muted-foreground">
                      手动成就的条件标识仅作唯一标记
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-threshold">条件阈值</Label>
                  <Input
                    id="edit-threshold"
                    type="number"
                    value={formThreshold}
                    onChange={(e) => setFormThreshold(e.target.value)}
                    disabled={updateMutation.isPending}
                  />
                  {selectedType === AchievementType.Event && (
                    <p className="text-[12px] text-muted-foreground">
                      事件类成就无需条件参数
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-title">奖励称号</Label>
                  <Select value={formTitleId || '__none__'} onValueChange={setFormTitleId} disabled={updateMutation.isPending}>
                    <SelectTrigger id="edit-title">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">无</SelectItem>
                      {titles.map((title) => (
                        <SelectItem key={title.id} value={String(title.id)}>
                          {title.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-sort">排序权重</Label>
                  <Input
                    id="edit-sort"
                    type="number"
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(e.target.value)}
                    disabled={updateMutation.isPending}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-3.5">
                  <div className="space-y-0.5">
                    <Label htmlFor="edit-active" className="text-sm">
                      启用成就
                    </Label>
                    <p className="text-[12px] text-muted-foreground">
                      禁用后玩家无法获取此成就
                    </p>
                  </div>
                  <Switch
                    id="edit-active"
                    checked={formIsActive}
                    onCheckedChange={setFormIsActive}
                    disabled={updateMutation.isPending}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Link to="/admin/achievements">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      disabled={updateMutation.isPending}
                    >
                      取消
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={updateMutation.isPending || !formName.trim() || !formDesc.trim() || !formConditionKey.trim()}
                    className="flex-1 sm:flex-none"
                    variant="gradient"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        保存修改
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 侧边操作区 */}
          <div className="space-y-6">
            <AchievementTypeGuide selectedType={selectedType} />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">成就操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <InfoRow label="条件键" value={achievement.condition_key} mono />
                <InfoRow
                  label="类型"
                  value={getTypeLabel(achievement.type)}
                />

                {/* 授予成就 */}
                <div className="pt-4 border-t border-border space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-1.5">
                    <Award className="h-4 w-4" />
                    授予成就
                  </h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="输入玩家 UUID"
                      value={formPlayerUuid}
                      onChange={(e) => setFormPlayerUuid(e.target.value)}
                      disabled={grantMutation.isPending}
                    />
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={grantMutation.isPending || !formPlayerUuid.trim()}
                      onClick={handleGrant}
                    >
                      {grantMutation.isPending ? (
                        <>
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          授予中...
                        </>
                      ) : (
                        <>
                          <Award className="mr-1.5 h-3.5 w-3.5" />
                          授予成就
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* 删除 */}
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full gap-1.5 text-sm"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    删除此成就
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="确认删除"
        description={`删除后，所有已获得此成就的玩家记录也将被清除。确定要删除成就「${achievement.name}」吗？`}
        confirmLabel="删除"
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        variant="destructive"
      />
    </motion.div>
  )
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[13px] text-muted-foreground shrink-0">
        {label}
      </span>
      <span
        className={`text-[13px] font-medium break-all ${mono ? 'font-mono text-xs' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}

function getTypeLabel(type: AchievementType): string {
  const map: Record<number, string> = {
    [AchievementType.Stat]: '统计类',
    [AchievementType.Event]: '事件类',
    [AchievementType.Special]: '特殊条件',
    [AchievementType.Manual]: '管理员手动',
  }
  return map[type] ?? '未知'
}
