/**
 * 新建成就页
 * 独立页面创建新的成就定义
 */

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useCreateAchievementMutation } from '#/api/endpoints/api-mc/admin-achievement'
import { useAdminTitles } from '#/api/endpoints/api-mc/admin-title'
import { Button } from '#/components/ui/button'
import { McCard } from '#/components/shared/mc-card'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Loader2, Save } from 'lucide-react'
import { Trophy } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { AchievementType } from '#/api/types'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'
import { useSetPageTitle } from '#/components/layout/page-title-context'
import { AchievementTypeGuide } from '#/components/public/achievement-type-guide'

export const Route = createFileRoute('/admin/achievements/create')({
  component: CreateAchievementPage,
})

function CreateAchievementPage() {
  const createMutation = useCreateAchievementMutation()
  const navigate = useNavigate()
  const setTitle = useSetPageTitle()
  const { data: titlesData } = useAdminTitles({ page_size: 100 })

  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formType, setFormType] = useState<string>(String(AchievementType.Stat))
  const [formConditionKey, setFormConditionKey] = useState('')
  const [formThreshold, setFormThreshold] = useState('')
  const [formTitleId, setFormTitleId] = useState('')
  const [formSortOrder, setFormSortOrder] = useState('0')

  useState(() => {
    setTitle('创建成就')
    return () => setTitle(null)
  })

  const titles = titlesData?.list ?? []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMutation.mutateAsync({
        name: formName.trim(),
        description: formDesc.trim(),
        type: Number(formType) as AchievementType,
        condition_key: formConditionKey.trim(),
        condition_params: formThreshold
          ? { threshold: Number(formThreshold) }
          : undefined,
        reward_config: formTitleId ? { title_id: formTitleId } : undefined,
        sort_order: formSortOrder ? Number(formSortOrder) : undefined,
      })
      toast.success('成就创建成功')
      navigate({ to: '/admin/achievements' })
    } catch {
      toast.error('创建失败')
    }
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
        <McSectionHeader
          title="创建成就"
          description="定义新的游戏成就，包括触发条件与奖励"
          icon={Trophy}
          variant="gold"
          className="mb-2"
        />
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <div className="grid gap-6 lg:grid-cols-3">
          <McCard
            variant="glass"
            color="gold"
            className="max-w-xl lg:col-span-2 p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="achievement-name">名称 *</Label>
                <Input
                  id="achievement-name"
                  placeholder="成就名称"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  maxLength={64}
                  disabled={createMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievement-desc">描述 *</Label>
                <Textarea
                  id="achievement-desc"
                  placeholder="成就描述"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  required
                  maxLength={255}
                  disabled={createMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievement-type">类型 *</Label>
                <Select
                  value={formType}
                  onValueChange={setFormType}
                  disabled={createMutation.isPending}
                >
                  <SelectTrigger id="achievement-type">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(AchievementType.Stat)}>
                      统计类
                    </SelectItem>
                    <SelectItem value={String(AchievementType.Event)}>
                      事件类
                    </SelectItem>
                    <SelectItem value={String(AchievementType.Special)}>
                      特殊条件
                    </SelectItem>
                    <SelectItem value={String(AchievementType.Manual)}>
                      管理员手动
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievement-key">条件键 *</Label>
                <Input
                  id="achievement-key"
                  placeholder="唯一条件标识，用于后端事件匹配"
                  value={formConditionKey}
                  onChange={(e) => setFormConditionKey(e.target.value)}
                  required
                  maxLength={64}
                  disabled={createMutation.isPending}
                />
                {selectedType === AchievementType.Manual && (
                  <p className="text-[12px] text-muted-foreground">
                    手动成就的条件标识仅作唯一标记
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievement-threshold">条件阈值</Label>
                <Input
                  id="achievement-threshold"
                  type="number"
                  placeholder="达到指定数值触发"
                  value={formThreshold}
                  onChange={(e) => setFormThreshold(e.target.value)}
                  disabled={createMutation.isPending}
                />
                {selectedType === AchievementType.Event && (
                  <p className="text-[12px] text-muted-foreground">
                    事件类成就无需条件参数
                  </p>
                )}
                {(selectedType === AchievementType.Stat ||
                  selectedType === AchievementType.Special) &&
                  formThreshold && (
                    <p className="text-[12px] text-muted-foreground">
                      统计类/特殊条件成就的条件阈值
                    </p>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievement-title">奖励称号</Label>
                <Select
                  value={formTitleId}
                  onValueChange={setFormTitleId}
                  disabled={createMutation.isPending}
                >
                  <SelectTrigger id="achievement-title">
                    <SelectValue placeholder="选择奖励称号（可选）" />
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
                <Label htmlFor="achievement-sort">排序权重</Label>
                <Input
                  id="achievement-sort"
                  type="number"
                  placeholder="0"
                  value={formSortOrder}
                  onChange={(e) => setFormSortOrder(e.target.value)}
                  disabled={createMutation.isPending}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Link to="/admin/achievements">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    disabled={createMutation.isPending}
                  >
                    取消
                  </Button>
                </Link>
                <Button
                  type="submit"
                  size="sm"
                  disabled={
                    createMutation.isPending ||
                    !formName.trim() ||
                    !formDesc.trim() ||
                    !formConditionKey.trim()
                  }
                  className="flex-1 sm:flex-none"
                  variant="gradient"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      创建中...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      创建成就
                    </>
                  )}
                </Button>
              </div>
            </form>
          </McCard>

          {/* 右侧类型引导 */}
          <AchievementTypeGuide selectedType={selectedType} />
        </div>
      </motion.div>
    </motion.div>
  )
}
