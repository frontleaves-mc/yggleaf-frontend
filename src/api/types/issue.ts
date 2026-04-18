/**
 * Issue 工单系统类型定义
 * 对接 Yggleaf API - Issue / IssueType
 */

// ─── 枚举类型 ────────────────────────────────────────────

/** 问题优先级 */
export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent'

/** 问题状态 */
export type IssueStatus =
  | 'registered'
  | 'pending'
  | 'processing'
  | 'resolved'
  | 'unplanned'
  | 'closed'

// ─── 实体 ────────────────────────────────────────────────

/** 问题类型实体（雪花算法 ID，使用 string 避免精度丢失） */
export interface IssueType {
  id: string
  name: string
  description: string
  sort_order: number
  is_enabled: boolean
}

/** 问题实体（雪花算法 ID，使用 string 避免精度丢失） */
export interface IssueEntity {
  id: string
  user_id: string
  issue_type_id: string
  title: string
  content: string
  priority: IssuePriority
  status: IssueStatus
  admin_note: string
  created_at: string
  updated_at: string
  closed_at: string | null
}

// ─── 列表响应 ────────────────────────────────────────────

/** 问题列表项 */
export interface IssueListItem {
  issue: IssueEntity
  issue_type_name: string
  reply_count: number
}

/** 问题列表响应（分页） */
export interface IssueListResponse {
  items: IssueListItem[]
  total: number
}

// ─── 详情响应 ────────────────────────────────────────────

/** 回复实体（雪花算法 ID，使用 string 避免精度丢失） */
export interface IssueReplyEntity {
  id: string
  issue_id: string
  user_id: string
  content: string
  is_admin_reply: boolean
  created_at: string
}

/** 回复项（含用户名） */
export interface IssueReplyItem {
  issue_reply: IssueReplyEntity
  username: string
}

/** 附件项（雪花算法 ID，使用 string 避免精度丢失） */
export interface IssueAttachmentItem {
  id: string
  file_name: string
  file_size: number
  file_url: string
  mime_type: string
}

/** 问题详情响应 */
export interface IssueDetailResponse {
  issue: IssueEntity
  issue_type: IssueType
  replies: IssueReplyItem[]
  attachments: IssueAttachmentItem[]
}

// ─── 请求类型（玩家） ────────────────────────────────────

/** 创建问题请求 */
export interface CreateIssueRequest {
  issue_type_id: string
  title: string
  content: string
  priority?: IssuePriority
}

/** 回复问题请求 */
export interface ReplyIssueRequest {
  content: string
}

/** 上传附件请求 */
export interface UploadAttachmentRequest {
  file_name: string
  content: string
  mime_type?: string
}

// ─── 请求类型（管理员） ──────────────────────────────────

/** 更新问题备注请求 */
export interface UpdateIssueNoteRequest {
  admin_note: string
}

/** 更新问题优先级请求 */
export interface UpdateIssuePriorityRequest {
  priority: IssuePriority
}

/** 更新问题状态请求 */
export interface UpdateIssueStatusRequest {
  status: IssueStatus
}

// ─── 请求类型（问题类型管理） ──────────────────────────────

/** 创建问题类型请求 */
export interface CreateIssueTypeRequest {
  name: string
  description?: string
  sort_order?: number
}

/** 更新问题类型请求 */
export interface UpdateIssueTypeRequest {
  name?: string
  description?: string
  sort_order?: number
  is_enabled?: boolean
}
