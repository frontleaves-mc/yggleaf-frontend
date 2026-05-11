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
  AdminGameProfileSkin,
  AdminGameProfileCape,
  AdminGameProfileItem,
  AdminGameProfileListResponse,
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
  UpdateIssueInfoRequest,
  UpdateIssueContentRequest,
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

export type {
  PlayerTitleResponse,
  EquippedTitleResponse,
  EquipTitleRequest,
} from './api-mc/title'

export type {
  PluginCredentialResponse,
  PluginCredentialListResponse,
  CreatePluginCredentialRequest,
  UpdatePluginCredentialRequest,
  PluginCredentialListParams,
} from './api-mc/plugin-credential'

export type {
  PlayerStatusInfo,
  ServerStatusResponse,
  ServerStatusListResponse,
} from './api-mc/server-status'

export type {
  ServerResponse,
  ServerListResponse,
  CreateServerRequest,
  UpdateServerRequest,
  SetServerEnabledRequest,
  SetServerPublicRequest,
  ServerListParams,
} from './api-mc/server-management'

export type {
  OnlineGameProfileResponse,
  PlayerOnlineResponse,
} from './api-mc/player-online'

// ─── 公告模块 ────────────────────────────────────────────

export { AnnouncementType } from './api-mc/announcement'

export type {
  AnnouncementStatus,
  AnnouncementListItem,
  AnnouncementResponse,
  AnnouncementListResponse,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
  AdminAnnouncementListParams,
  PublicAnnouncementListParams,
} from './api-mc/announcement'

export type {
  ScheduleMode,
  ScheduleItemResponse,
  ScheduleItemInput,
  ScheduleResponse,
  ScheduleListResponse,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  AdminScheduleListParams,
} from './api-mc/announcement-schedule'
