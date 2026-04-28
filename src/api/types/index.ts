/**
 * API 类型统一导出
 */

export type { OAuthTokenData, TokenPair } from './api-auth/auth'

export type {
  RoleName,
  Role,
  ModelType,
  BaseResponse,
  User,
  UserExtend,
  UserCurrentResponse,
  UpdateGamePasswordRequest,
  GameProfile,
  GameProfileListResponse,
  GameProfileQuota,
  SkinLibrary,
  CapeLibrary,
  LibraryQuota,
  LibraryListResponse,
  CreateGameProfileRequest,
  UpdateUsernameRequest,
  CreateSkinRequest,
  UpdateSkinRequest,
  CreateCapeRequest,
  UpdateCapeRequest,
  SetSkinRequest,
  SetCapeRequest,
  LibrarySimpleItem,
  LibrarySimpleListResponse,
  AdminUserItem,
  AdminUserListResponse,
  AdminUserBasic,
  GameProfileQuotaInfo,
  LibraryQuotaInfo,
  AdminSkinItem,
  AdminCapeItem,
  AdminUserDetailResponse,
  AdjustGameProfileQuotaRequest,
} from './api-auth/user'

export type { ApiResponse, PaginatedResponse } from './response'

// ApiError 需要同时导出类型和值（class）
export { ApiError } from './response'

export type {
  IssuePriority,
  IssueStatus,
  IssueType,
  IssueEntity,
  IssueListItem,
  IssueListResponse,
  IssueReplyEntity,
  IssueReplyItem,
  IssueAttachmentItem,
  IssueDetailResponse,
  CreateIssueRequest,
  ReplyIssueRequest,
  UploadAttachmentRequest,
  UpdateIssueNoteRequest,
  UpdateIssuePriorityRequest,
  UpdateIssueStatusRequest,
  CreateIssueTypeRequest,
  UpdateIssueTypeRequest,
} from './api-auth/issue'

export type { ModFileMetadata, ModsMetadataResponse } from './api-auth/sync'

// ─── 锋楪核心 (mcApiClient) 类型 ──────────────────────────────

export { TitleType } from './api-mc/title'

export type {
  TitleResponse,
  TitleListResponse,
  CreateTitleRequest,
  UpdateTitleRequest,
  AssignTitleRequest,
  AdminTitleListParams,
} from './api-mc/title'
