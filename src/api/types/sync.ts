/**
 * 同步接口相关类型
 * 对接 /sync/mods/metadata 等公开接口
 */

/** 模组文件元数据（对应 sync.FileMetadata） */
export interface ModFileMetadata {
  /** SHA-256 哈希值，格式 "sha256:<hex>" */
  hash: string
  /** 文件名，如 "jei-1.20.1.jar" */
  name: string
  /** 相对路径，如 "mods/jei-1.20.1.jar" */
  path: string
  /** 文件大小（字节） */
  size: number
}

/** 模组元数据响应（对应 sync.SyncMetadataResponse） */
export interface ModsMetadataResponse {
  /** 模组文件列表 */
  files: ModFileMetadata[]
  /** 服务端扫描时间（ISO 8601） */
  scanned_at: string
  /** 模组总数 */
  total: number
}
