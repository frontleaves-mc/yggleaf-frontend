/**
 * 用户与游戏相关类型定义
 * 对接 Yggleaf API - User / GameProfile / SkinLibrary / CapeLibrary
 */

/** 角色名称枚举 */
export type RoleName = 'SUPER_ADMIN' | 'ADMIN' | 'PLAYER'

/** 角色信息 */
export interface Role {
  /** 角色描述 */
  description: string
  /** 角色显示名称 */
  display_name: string
  /** 角色名称 */
  name: RoleName
}

/** 皮肤模型类型 */
export type ModelType = 1 | 2 // 1=Classic(Steve), 2=Slim(Alex)

/** 基础响应信息（内嵌于各响应中） */
export interface BaseResponse {
  /** 业务状态码（200 表示成功） */
  code: number
  /** 请求追踪标识（对应 HTTP 的 X-Request-UUID） */
  context: string
  /** 补充性错误详情，仅在错误场景下填充 */
  error_message?: string
  /** 人类可读的描述信息 */
  message: string
  /** 输出标识（如 "Success"、"PARAMETER_ERROR"） */
  output?: string
  /** 请求处理耗时（微秒），仅在调试模式下填充 */
  overhead?: number
}

/** 用户实体 */
export interface User {
  /** 用户 ID */
  id: number
  /** 用户用户名 */
  username: string
  /** 用户邮箱 */
  email: string
  /** 用户手机号 */
  phone: string
  /** 关联角色名称 */
  role_name: RoleName
  /** 关联角色详情 */
  role: Role
  /** 用户是否被封禁禁止登录 */
  has_ban: boolean
  /** 用户被监禁的时间 */
  jailed_at: string
  /** 披风库关联 */
  cape_libraries: CapeLibrary[]
  /** 皮肤库关联 */
  skin_libraries: SkinLibrary[]
  /** 游戏档案关联 */
  game_profiles: GameProfile[]
  /** 资源库配额关联 */
  library_quotas: LibraryQuota[]
  /** 更新时间 */
  updated_at: string
}

/** 游戏档案实体 */
export interface GameProfile {
  /** 档案 ID */
  id: number
  /** 游戏内用户名 */
  name: string
  /** Minecraft UUID */
  uuid: string
  /** 关联用户 ID */
  user_id: number
  /** 关联皮肤库 ID */
  skin_library_id: number
  /** 关联披风库 ID */
  cape_library_id: number
  /** 关联披风库详情 */
  cape_library?: CapeLibrary
  /** 关联皮肤库详情 */
  skin_library?: SkinLibrary
  /** 关联用户详情 */
  user?: User
  /** 更新时间 */
  updated_at: string
}

/** 皮肤库实体 */
export interface SkinLibrary {
  /** 皮肤 ID */
  id: number
  /** 皮肤名称 */
  name: string
  /** 皮肤模型 (1=classic, 2=slim) */
  model: ModelType
  /** 皮肤纹理文件 ID (雪花算法) */
  texture: number
  /** 皮肤纹理哈希 */
  texture_hash: string
  /** 是否公开 */
  is_public: boolean
  /** 关联用户 ID (为空代表系统内置皮肤) */
  user_id?: number
  /** 关联用户详情 */
  user?: User
  /** 更新时间 */
  updated_at: string
}

/** 披风库实体 */
export interface CapeLibrary {
  /** 披风 ID */
  id: number
  /** 披风名称 */
  name: string
  /** 披风纹理文件 ID (雪花算法) */
  texture: number
  /** 披风纹理哈希 */
  texture_hash: string
  /** 是否公开 */
  is_public: boolean
  /** 关联用户 ID (为空代表系统内置披风) */
  user_id?: number
  /** 关联用户详情 */
  user?: User
  /** 更新时间 */
  updated_at: string
}

/** 资源库配额实体 */
export interface LibraryQuota {
  /** 配额 ID */
  id: number
  /** 皮肤配额 */
  skins_private_total: number
  /** 私有皮肤已使用额度 */
  skins_private_used: number
  /** 公开皮肤总额度 */
  skins_public_total: number
  /** 公开皮肤已使用额度 */
  skins_public_used: number
  /** 披风配额 */
  capes_private_total: number
  /** 私有披风已使用额度 */
  capes_private_used: number
  /** 公开披风总额度 */
  capes_public_total: number
  /** 公开披风已使用额度 */
  capes_public_used: number
  /** 关联用户 ID */
  user_id: number
  /** 关联用户详情 */
  user?: User
  /** 更新时间 */
  updated_at: string
}

/** 游戏档案列表响应（items 包装） */
export interface GameProfileListResponse {
  /** 档案列表 */
  items: GameProfile[]
}

/** 游戏档案配额实体 */
export interface GameProfileQuota {
  /** 配额 ID */
  id: number
  /** 总额度 */
  total: number
  /** 已使用额度 */
  used: number
  /** 关联用户 ID */
  user_id: number
  /** 关联用户详情 */
  user?: User
  /** 更新时间 */
  updated_at: string
}

/** 创建游戏档案请求 */
export interface CreateGameProfileRequest {
  /** 游戏内用户名 */
  name: string
}

/** 修改用户名请求 */
export interface UpdateUsernameRequest {
  /** 新用户名 */
  new_name: string
}

/** 创建皮肤请求 */
export interface CreateSkinRequest {
  /** 皮肤名称 */
  name: string
  /** 皮肤模型 (1=classic, 2=slim) */
  model: ModelType
  /** 皮肤纹理文件 ID */
  texture: number
  /** 是否公开 */
  is_public?: boolean
}

/** 更新皮肤请求 */
export interface UpdateSkinRequest extends Partial<CreateSkinRequest> {}

/** 创建披风请求 */
export interface CreateCapeRequest {
  /** 披风名称 */
  name: string
  /** 披风纹理文件 ID */
  texture: number
  /** 是否公开 */
  is_public?: boolean
}

/** 更新披风请求 */
export interface UpdateCapeRequest extends Partial<CreateCapeRequest> {}
