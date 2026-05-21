/**
 * 公告模块共享辅助函数
 * Badge 渲染，供列表页和编辑页复用
 */

import { Badge } from '#/components/ui/badge'
import {
  AnnouncementType,
  AnnouncementStatus,
} from '#/api/types/api-mc/announcement'

/** 公告类型 Badge */
export function getAnnouncementTypeBadge(type: number) {
  const map: Record<
    number,
    { label: string; className: string; dotClass: string }
  > = {
    [AnnouncementType.InSite]: {
      label: '站内',
      className:
        'rounded-full border border-blue-500/20 bg-blue-500/8 text-blue-600 dark:text-blue-400',
      dotClass: 'bg-blue-500',
    },
    [AnnouncementType.Global]: {
      label: '全局',
      className:
        'rounded-full border border-amber-500/20 bg-amber-500/8 text-amber-600 dark:text-amber-400',
      dotClass: 'bg-amber-500',
    },
  }
  const info = map[type] ?? {
    label: '未知',
    className: 'bg-muted text-muted-foreground',
    dotClass: 'bg-muted-foreground',
  }
  return (
    <Badge variant="secondary" className={info.className}>
      <span className={`inline-block size-1.5 rounded-full ${info.dotClass}`} />
      {info.label}
    </Badge>
  )
}

/** 公告状态 Badge */
export function getAnnouncementStatusBadge(status: number) {
  const map: Record<
    number,
    { label: string; className: string; dotClass: string }
  > = {
    [AnnouncementStatus.Draft]: {
      label: '草稿',
      className:
        'rounded-full border border-yellow-500/20 bg-yellow-500/8 text-yellow-600 dark:text-yellow-400',
      dotClass: 'bg-yellow-500',
    },
    [AnnouncementStatus.Published]: {
      label: '已发布',
      className:
        'rounded-full border border-green-500/20 bg-green-500/8 text-green-600 dark:text-green-400',
      dotClass: 'bg-green-500',
    },
    [AnnouncementStatus.Offline]: {
      label: '已下线',
      className:
        'rounded-full border border-gray-500/20 bg-gray-500/8 text-gray-600 dark:text-gray-400',
      dotClass: 'bg-gray-500',
    },
  }
  const info = map[status] ?? {
    label: '未知',
    className: 'bg-muted text-muted-foreground',
    dotClass: 'bg-muted-foreground',
  }
  return (
    <Badge variant="secondary" className={info.className}>
      <span className={`inline-block size-1.5 rounded-full ${info.dotClass}`} />
      {info.label}
    </Badge>
  )
}
