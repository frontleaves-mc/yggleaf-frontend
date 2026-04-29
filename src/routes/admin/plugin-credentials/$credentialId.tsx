/**
 * 管理员端 - 插件凭证详情页
 * 展示脱敏信息 + 编辑描述 + 重置密钥
 */

import { createFileRoute, Link, useParams, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, Pencil, Save, X, RefreshCw } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Textarea } from '#/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { LoadingPage } from '#/components/public/loading-page'
import { ConfirmDialog } from '#/components/public/confirm-dialog'
import { SecretKeyRevealDialog } from './components/secret-key-reveal-dialog'
import {
  usePluginCredentialDetail,
  useUpdatePluginCredentialMutation,
  useResetPluginCredentialKeyMutation,
} from '#/api/endpoints/api-mc/admin-plugin-credential'
import { useUserInfo } from '#/api/endpoints/api-auth/user'
import { toast } from 'sonner'
import { isSuperAdmin } from '#/lib/permissions'

// ─── 动画预设 ──────────────────────────────────────────────

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

// ─── 路由注册 ──────────────────────────────────────────────

export const Route = createFileRoute('/admin/plugin-credentials/$credentialId')({
  component: CredentialDetailPage,
})

function CredentialDetailPage() {
  const navigate = useNavigate()
  const { credentialId } = useParams({ strict: false })
  const { data: userInfo } = useUserInfo()
  if (!isSuperAdmin(userInfo?.user?.role_name)) {
    navigate({ to: '/admin' })
    return null
  }

  // ─── 数据查询 ────────────────────────────────────────
  const { data: credential, isLoading, error } = usePluginCredentialDetail(credentialId!)
  const updateMutation = useUpdatePluginCredentialMutation()
  const resetKeyMutation = useResetPluginCredentialKeyMutation()

  // ─── 状态 ────────────────────────────────────────────
  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [editDesc, setEditDesc] = useState('')
  const [isResetKeyDialogOpen, setIsResetKeyDialogOpen] = useState(false)
  const [isKeyRevealDialogOpen, setIsKeyRevealDialogOpen] = useState(false)
  const [revealedKey, setRevealedKey] = useState('')
  const [revealedCredentialName, setRevealedCredentialName] = useState('')

  // ─── 404 容错 ────────────────────────────────────────
  if (error) {
    toast.error('凭证不存在或已被删除')
    navigate({ to: '/admin/plugin-credentials' })
    return null
  }

  if (isLoading) return <LoadingPage />

  if (!credential) {
    return (
      <div className="text-center py-12 text-muted-foreground">凭证不存在</div>
    )
  }

  // ─── 操作处理 ────────────────────────────────────────

  const startEditDesc = () => {
    setEditDesc(credential.description)
    setIsEditingDesc(true)
  }

  const cancelEditDesc = () => {
    setIsEditingDesc(false)
    setEditDesc('')
  }

  const handleSaveDesc = async () => {
    if (!editDesc.trim()) return
    try {
      await updateMutation.mutateAsync({
        id: credential.id,
        data: { description: editDesc.trim() },
      })
      toast.success('描述已更新')
      setIsEditingDesc(false)
    } catch {
      toast.error('更新失败')
    }
  }

  const handleResetKey = async () => {
    try {
      const result = await resetKeyMutation.mutateAsync({ id: credential.id })
      toast.success('密钥已重置')
      setIsResetKeyDialogOpen(false)
      setRevealedKey(result.secret_key)
      setRevealedCredentialName(credential.name)
      setIsKeyRevealDialogOpen(true)
    } catch {
      toast.error('重置失败')
    }
  }

  // ─── 渲染 ────────────────────────────────────────────

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 返回导航 */}
      <motion.div variants={fadeUpItem}>
        <Link
          to="/admin/plugin-credentials"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回凭证列表
        </Link>
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 主信息卡 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">凭证详情</CardTitle>
                  <CardDescription>
                    查看和管理插件凭证信息
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  {credential.id.slice(0, 8)}...
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* 凭证名称 */}
              <div className="space-y-1">
                <p className="text-[13px] text-muted-foreground">凭证名称</p>
                <p className="text-sm font-medium">{credential.name}</p>
              </div>

              {/* 描述（可编辑） */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-muted-foreground">描述</p>
                  {!isEditingDesc && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={startEditDesc}
                    >
                      <Pencil className="mr-1 h-3 w-3" />
                      编辑
                    </Button>
                  )}
                </div>
                {isEditingDesc ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      placeholder="凭证用途描述"
                      maxLength={255}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={handleSaveDesc}
                        disabled={updateMutation.isPending || !editDesc.trim()}
                      >
                        <Save className="h-3 w-3" />
                        {updateMutation.isPending ? '保存中...' : '保存'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={cancelEditDesc}
                        disabled={updateMutation.isPending}
                      >
                        <X className="h-3 w-3" />
                        取消
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">{credential.description || '-'}</p>
                )}
              </div>

              {/* 密钥（脱敏） */}
              <div className="space-y-1">
                <p className="text-[13px] text-muted-foreground">密钥</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {credential.secret_key}
                </p>
              </div>

              {/* 创建时间 */}
              <div className="space-y-1">
                <p className="text-[13px] text-muted-foreground">创建时间</p>
                <p className="text-sm">
                  {new Date(credential.created_at).toLocaleString('zh-CN')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 侧边操作卡 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">密钥操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[13px] text-muted-foreground">
                重置密钥将使当前密钥立即失效。重置后会生成新的密钥，请确保及时更新使用该密钥的插件配置。
              </p>
              <Button
                variant="destructive"
                className="w-full gap-1.5 text-sm"
                onClick={() => setIsResetKeyDialogOpen(true)}
              >
                <RefreshCw className="h-4 w-4" />
                重置密钥
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* 重置密钥确认 */}
      <ConfirmDialog
        open={isResetKeyDialogOpen}
        onOpenChange={setIsResetKeyDialogOpen}
        title="确认重置密钥"
        description={`确定要重置凭证「${credential.name}」的密钥吗？旧密钥将立即失效，使用该密钥的插件将无法继续访问。`}
        confirmLabel="重置密钥"
        onConfirm={handleResetKey}
        loading={resetKeyMutation.isPending}
        variant="destructive"
      />

      {/* 密钥展示弹窗 */}
      <SecretKeyRevealDialog
        open={isKeyRevealDialogOpen}
        onOpenChange={setIsKeyRevealDialogOpen}
        secretKey={revealedKey}
        credentialName={revealedCredentialName}
      />
    </motion.div>
  )
}
