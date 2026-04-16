/**
 * SkinPreview - 3D 皮肤/披风预览组件
 *
 * 封装 react-skinview3d，提供统一的 3D 角色渲染预览。
 * 自动测量容器尺寸并填满，支持纯皮肤、纯披风两种模式。
 */

import { useEffect, useRef, useState } from 'react'
import { ReactSkinview3d } from 'react-skinview3d'

interface SkinPreviewProps {
  /** 皮肤纹理下载链接（API 返回的 texture_url） */
  skinUrl?: string
  /** 披风纹理下载链接（API 返回的 texture_url） */
  capeUrl?: string
}

/** 默认 Steve 皮肤 URL（仅展示披风时作为底模） */
const DEFAULT_SKIN_URL = 'https://crafatar.com/skins/8667ba71-b85a-4004-af54-457a9734eed7'

/** 缩放系数：让 3D 模型略小于容器，留出呼吸空间 */
const SCALE = 0.75

export function SkinPreview({ skinUrl, capeUrl }: SkinPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 150, height: 200 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const measure = () => {
      const { clientWidth, clientHeight } = el
      if (clientWidth > 0 && clientHeight > 0) {
        setSize({
          width: Math.round(clientWidth * SCALE),
          height: Math.round(clientHeight * SCALE),
        })
      }
    }

    // ResizeObserver 跟随容器尺寸变化自动重绘
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    measure()

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <ReactSkinview3d
        skinUrl={skinUrl ?? DEFAULT_SKIN_URL}
        capeUrl={capeUrl}
        width={size.width}
        height={size.height}
      />
    </div>
  )
}
