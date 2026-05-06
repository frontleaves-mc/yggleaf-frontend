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
  const map: Record<number, { label: string; className: string }> = {
    [AnnouncementType.InSite]: {
      label: '站内',
      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    [AnnouncementType.Global]: {
      label: '全局',
      className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
  }
  const info = map[type] ?? {
    label: '未知',
    className: 'bg-muted text-muted-foreground',
  }
  return (
    <Badge variant="secondary" className={info.className}>
      {info.label}
    </Badge>
  )
}

/** 公告状态 Badge */
export function getAnnouncementStatusBadge(status: number) {
  const map: Record<number, { label: string; className: string }> = {
    [AnnouncementStatus.Draft]: {
      label: '草稿',
      className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    },
    [AnnouncementStatus.Published]: {
      label: '已发布',
      className: 'bg-green-500/10 text-green-600 dark:text-green-400',
    },
    [AnnouncementStatus.Offline]: {
      label: '已下线',
      className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    },
  }
  const info = map[status] ?? {
    label: '未知',
    className: 'bg-muted text-muted-foreground',
  }
  return (
    <Badge variant="secondary" className={info.className}>
      {info.label}
    </Badge>
  )
}
