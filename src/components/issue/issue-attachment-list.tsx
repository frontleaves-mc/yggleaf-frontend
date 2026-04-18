/**
 * IssueAttachmentList - 附件列表（缩略图网格 + 图片预览）
 *
 * 设计方向：精致文件管理器风格
 * - 图片 → 正方形缩略图 + 悬浮信息 + Lightbox 预览
 * - 非图片 → 类型图标卡片 + 文件信息
 * - 响应式网格：1/2/4/6 列自适应
 */

import { useState, useRef, useMemo, useCallback } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { Button } from '#/components/ui/button'
import { useUploadAttachmentMutation, useDeleteAttachmentMutation } from '#/api/endpoints/issue'
import { ConfirmDialog } from '#/components/public/confirm-dialog'
import {
  Loader2,
  Upload,
  Trash2,
  FileText,
  FileArchive,
  FileType,
  Image as ImageIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import type { IssueAttachmentItem } from '#/api/types'

// ─── Types ────────────────────────────────────────────────

interface IssueAttachmentListProps {
  attachments: IssueAttachmentItem[]
  issueId: string
  canUpload?: boolean
  canDelete?: boolean
}

// ─── Helpers ──────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isImageMime(mime: string): boolean {
  return mime.startsWith('image/')
}

function getFileIcon(mime: string) {
  if (mime === 'application/pdf') return FileText
  if (
    mime.includes('zip') ||
    mime.includes('rar') ||
    mime.includes('7z') ||
    mime.includes('tar') ||
    mime.includes('compressed')
  )
    return FileArchive
  if (mime.includes('text') || mime.includes('document')) return FileText
  return FileType
}

/** 固定响应式网格：移动端 2 列 / 平板 4 列 / 桌面 6 列 */
const GRID_CLASS = 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'

// ─── Sub-components ───────────────────────────────────────

/** 图片缩略图卡片 */
function ImageThumbnail({
  attachment,
  index,
  onPreview,
  canDelete,
  onDelete,
}: {
  attachment: IssueAttachmentItem
  index: number
  onPreview: (index: number) => void
  canDelete: boolean
  onDelete: (att: IssueAttachmentItem) => void
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg border bg-[var(--surface)] transition-shadow duration-200 hover:shadow-md">
      {/* 缩略图 */}
      <img
        src={attachment.file_url}
        alt={attachment.file_name}
        loading="lazy"
        className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />

      {/* 加载骨架 */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)]">
          <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
        </div>
      )}

      {/* 悬浮信息覆盖层 */}
      <div className="absolute inset-x-0 bottom-0 flex translate-y-full flex-col gap-0.5 bg-gradient-to-t from-black/70 to-transparent p-2 pb-1.5 pt-5 transition-transform duration-200 group-hover:translate-y-0">
        <span className="truncate text-xs font-medium text-white/90">
          {attachment.file_name}
        </span>
        <span className="text-[10px] text-white/60">
          {formatFileSize(attachment.file_size)}
        </span>
      </div>

      {/* 点击打开预览 */}
      <button
        type="button"
        onClick={() => onPreview(index)}
        className="absolute inset-0 cursor-zoom-in"
        aria-label={`预览图片 ${attachment.file_name}`}
      />

      {/* 删除按钮（悬浮显示） */}
      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 z-10 h-6 w-6 rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:bg-destructive group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(attachment)
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

/** 非图片文件卡片 */
function FileCard({
  attachment,
  canDelete,
  onDelete,
}: {
  attachment: IssueAttachmentItem
  canDelete: boolean
  onDelete: (att: IssueAttachmentItem) => void
}) {
  const Icon = getFileIcon(attachment.mime_type)

  return (
    <a
      href={attachment.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border bg-[var(--surface)] p-3 transition-colors duration-200 hover:border-[var(--lagoon)]/30 hover:bg-[var(--surface-strong)]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--lagoon)]/8 text-[var(--lagoon)] transition-colors duration-200 group-hover:bg-[var(--lagoon)]/15">
        <Icon className="h-5 w-5" />
      </div>
      <div className="w-full text-center">
        <p className="truncate text-xs font-medium leading-tight">
          {attachment.file_name}
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          {formatFileSize(attachment.file_size)}
        </p>
      </div>

      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 z-10 h-6 w-6 rounded-full opacity-0 transition-opacity duration-200 hover:text-destructive group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete(attachment)
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </a>
  )
}

// ─── Main Component ───────────────────────────────────────

export function IssueAttachmentList({
  attachments,
  issueId,
  canUpload = false,
  canDelete = false,
}: IssueAttachmentListProps) {
  const uploadMutation = useUploadAttachmentMutation(issueId)
  const deleteMutation = useDeleteAttachmentMutation(issueId)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [deleteTarget, setDeleteTarget] = useState<IssueAttachmentItem | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  // 分离图片和非图片附件
  const { images, files } = useMemo(() => {
    const imgs: IssueAttachmentItem[] = []
    const fls: IssueAttachmentItem[] = []
    for (const att of attachments) {
      if (isImageMime(att.mime_type)) imgs.push(att)
      else fls.push(att)
    }
    return { images: imgs, files: fls }
  }, [attachments])

  // Lightbox slides（仅图片）
  const lightboxSlides = useMemo(
    () => images.map((img) => ({ src: img.file_url, alt: img.file_name })),
    [images],
  )

  const handlePreview = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('文件大小不能超过 10MB')
      return
    }

    try {
      const reader = new FileReader()
      reader.onload = async () => {
        const mimeBase64 = reader.result as string
        await uploadMutation.mutateAsync({
          file_name: file.name,
          content: mimeBase64,
          mime_type: file.type,
        })
        toast.success('附件上传成功')
      }
      reader.readAsDataURL(file)
    } catch {
      toast.error('上传失败，请稍后重试')
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success('附件已删除')
      setDeleteTarget(null)
    } catch {
      toast.error('删除失败')
    }
  }

  // 无附件时显示空状态
  if (attachments.length === 0 && !canUpload) {
    return null
  }

  return (
    <div className="space-y-3">
      {/* 图片网格 */}
      {images.length > 0 && (
        <div className={`grid gap-2 ${GRID_CLASS}`}>
          {images.map((att, i) => (
            <ImageThumbnail
              key={att.id}
              attachment={att}
              index={i}
              onPreview={handlePreview}
              canDelete={canDelete}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* 非图片文件网格 */}
      {files.length > 0 && (
        <div className={`grid gap-2 ${getGridClass(files.length)}`}>
          {files.map((att) => (
            <div key={att.id} className="relative">
              <FileCard
                attachment={att}
                canDelete={canDelete}
                onDelete={setDeleteTarget}
              />
            </div>
          ))}
        </div>
      )}

      {/* 上传按钮 */}
      {canUpload && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.txt,.zip,.rar,.7z"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-1.5 h-4 w-4" />
            )}
            上传附件
          </Button>
        </div>
      )}

      {/* Lightbox 图片预览 */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={lightboxSlides}
      />

      {/* 删除确认弹窗 */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="确认删除"
        description={`确定要删除附件「${deleteTarget?.file_name}」吗？此操作不可撤销。`}
        confirmLabel="删除"
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        variant="destructive"
      />
    </div>
  )
}
