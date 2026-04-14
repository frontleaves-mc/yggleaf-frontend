/**
 * UploadZone - 拖拽上传区组件
 *
 * 支持拖拽和点击浏览的文件上传区域，
 * 选中文件后显示预览和文件信息。
 */

import { useCallback, useRef, useState } from 'react'
import { Upload, X, Image } from 'lucide-react'
import { cn } from '#/lib/utils'

interface UploadZoneProps {
  /** 接受的文件类型，如 '.png' */
  accept: string
  /** 区域标签，如 "皮肤" / "披风" */
  label: string
  /** 文件选中回调 */
  onFileSelect: (file: File) => void
  /** 选中文件后的预览 URL */
  previewUrl?: string
  /** 是否正在处理中 */
  isProcessing?: boolean
  /** 宽高比样式 */
  aspectRatio?: string
}

export function UploadZone({
  accept,
  label,
  onFileSelect,
  previewUrl,
  isProcessing,
  aspectRatio = 'h-40',
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) {
        setFileName(file.name)
        onFileSelect(file)
      }
    },
    [onFileSelect],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setFileName(file.name)
        onFileSelect(file)
      }
    },
    [onFileSelect],
  )

  const handleClear = useCallback(() => {
    setFileName(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  return (
    <div
      className={cn(
        'relative rounded-xl transition-all cursor-pointer',
        aspectRatio,
        isDragging
          ? 'border-2 border-primary bg-primary/5'
          : 'border border-dashed border-border/70 bg-gradient-to-b from-primary/5 to-primary/10',
        isProcessing && 'pointer-events-none opacity-60',
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      {previewUrl || fileName ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={`${label}预览`}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
              <Image className="size-8 text-primary" />
            </div>
          )}
          {fileName && (
            <div className="flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-xs text-foreground backdrop-blur-sm">
              <span className="max-w-[120px] truncate">{fileName}</span>
              <button
                type="button"
                className="rounded-full p-0.5 hover:bg-muted transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClear()
                }}
              >
                <X className="size-3 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Upload className="size-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            拖拽 {label} 文件到此处
          </p>
          <p className="text-[11px] text-muted-foreground/60">或点击浏览</p>
        </div>
      )}
    </div>
  )
}
