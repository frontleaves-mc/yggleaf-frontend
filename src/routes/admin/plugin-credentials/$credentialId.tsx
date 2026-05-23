/**
 * 管理员端 - 插件凭证详情页
 * 展示脱敏信息 + 编辑描述 + 重置密钥
 */

import {
  createFileRoute,
  Link,
  useParams,
  useNavigate,
} from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  Pencil,
  Save,
  X,
  RefreshCw,
  KeyRound,
  Lock,
  ShieldAlert,
} from 'lucide-react'
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
import { SecretKeyRevealDialog } from '#/components/shared/secret-key-reveal-dialog'
import {
  usePluginCredentialDetail,
  useUpdatePluginCredentialMutation,
  useResetPluginCredentialKeyMutation,
} from '#/api/endpoints/api-mc/admin-plugin-credential'
import { useUserInfo } from '#/api/endpoints/api-auth/user'
import { toast } from 'sonner'
import { isSuperAdmin } from '#/lib/permissions'
import { useSetPageTitle } from '#/components/layout/page-title-context'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'

// ─── 路由注册 ──────────────────────────────────────────────

export const Route = createFileRoute('/admin/plugin-credentials/$credentialId')(
  {
    component: CredentialDetailPage,
  },
)

function CredentialDetailPage() {
  const navigate = useNavigate()
  const { credentialId } = useParams({ strict: false })
  const { data: userInfo } = useUserInfo()
  if (!isSuperAdmin(userInfo?.user?.role_name)) {
    navigate({ to: '/admin' })
    return null
  }

  // ─── 数据查询 ────────────────────────────────────────
  const {
    data: credential,
    isLoading,
    error,
  } = usePluginCredentialDetail(credentialId!)
  const updateMutation = useUpdatePluginCredentialMutation()
  const resetKeyMutation = useResetPluginCredentialKeyMutation()
  const setTitle = useSetPageTitle()

  // ─── 状态 ────────────────────────────────────────────
  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [editDesc, setEditDesc] = useState('')
  const [isResetKeyDialogOpen, setIsResetKeyDialogOpen] = useState(false)
  const [isKeyRevealDialogOpen, setIsKeyRevealDialogOpen] = useState(false)
  const [revealedKey, setRevealedKey] = useState('')
  const [revealedCredentialName, setRevealedCredentialName] = useState('')

  useEffect(() => {
    if (credential) setTitle(credential.name)
    return () => setTitle(null)
  }, [credential, setTitle])

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
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="border-b border-transparent group-hover:border-foreground/30 transition-colors">
            返回凭证列表
          </span>
        </Link>
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 主信息卡 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
                      <KeyRound className="size-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold tracking-tight">
                        {credential.name}
                      </CardTitle>
                      <CardDescription>插件凭证详情与管理</CardDescription>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="font-mono text-xs shrink-0 mt-1"
                >
                  {credential.id.slice(0, 8)}…
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* 凭证名称 */}
              <InfoRow label="凭证名称" value={credential.name} />

              {/* 描述（可编辑） */}
              <div className="flex items-start justify-between gap-3">
                <span className="text-[13px] text-muted-foreground shrink-0 pt-1">
                  描述
                </span>
                <div className="flex-1 min-w-0">
                  {!isEditingDesc && (
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-medium">
                        {credential.description || '-'}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs shrink-0"
                        onClick={startEditDesc}
                      >
                        <Pencil data-icon="inline-start" className="size-3" />
                        编辑
                      </Button>
                    </div>
                  )}
                  {isEditingDesc && (
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
                          disabled={
                            updateMutation.isPending || !editDesc.trim()
                          }
                        >
                          <Save className="size-3" />
                          {updateMutation.isPending ? '保存中...' : '保存'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={cancelEditDesc}
                          disabled={updateMutation.isPending}
                        >
                          <X className="size-3" />
                          取消
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 密钥（脱敏） - 安全展示区 */}
              <div className="rounded-lg border border-border/60 bg-muted/30 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                  <Lock className="size-3" />
                  密钥（脱敏）
                </div>
                <p className="font-mono text-xs text-muted-foreground bg-background rounded-md px-3 py-2 border border-border/40">
                  {credential.secret_key}
                </p>
              </div>

              {/* 创建时间 */}
              <InfoRow
                label="创建时间"
                value={new Date(credential.created_at).toLocaleString('zh-CN')}
              />
            </CardContent>
          </Card>

          {/* 侧边操作卡 */}
          <Card className="border-destructive/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-4 text-destructive" />
                <CardTitle className="text-base">密钥操作</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-destructive/5 border border-destructive/10 p-3 space-y-2">
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  重置密钥将使当前密钥立即失效。重置后会生成新的密钥，请确保及时更新使用该密钥的插件配置。
                </p>
              </div>
              <Button
                variant="destructive"
                className="w-full gap-1.5 text-sm"
                onClick={() => setIsResetKeyDialogOpen(true)}
              >
                <RefreshCw className="size-4" />
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[13px] text-muted-foreground shrink-0">
        {label}
      </span>
      <span className="text-[13px] font-medium break-all">{value}</span>
    </div>
  )
}
