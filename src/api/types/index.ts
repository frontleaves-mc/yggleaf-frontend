/**
 * API 类型统一导出
 */

export type {
  OAuthTokenData,
  TokenPair,
} from './auth'

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
} from './user'

export type {
  ApiResponse,
  PaginatedResponse,
} from './response'

// ApiError 需要同时导出类型和值（class）
export { ApiError } from './response'
