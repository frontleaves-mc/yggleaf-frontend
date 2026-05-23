/**
 * 服务器负载数据类型定义
 * 对接锋楪核心后端 — 超管-服务器负载接口
 *
 * 接口路径：
 *   GET /admin/servers/load/realtime       — 批量查询服务器实时负载
 *   GET /admin/servers/load/{id}/realtime   — 查询单台服务器实时负载
 *   GET /admin/servers/load/{id}/history    — 查询服务器历史负载趋势
 */

// ─── 嵌套结构类型 ──────────────────────────────────────────

/** CPU 信息 */
export type CPUInfo = {
  /** CPU 核心数 */
  cores: number
  /** CPU 使用率 (0-100) */
  usage_percent: number
}

/** 物理内存信息 */
export type MemoryInfo = {
  /** 空闲内存 (bytes) */
  free_bytes: number
  /** 总内存 (bytes) */
  total_bytes: number
  /** 已用内存 (bytes) */
  used_bytes: number
}

/** JVM 内存信息 */
export type JVMInfo = {
  /** JVM 最大内存 (bytes) */
  max_memory_bytes: number
  /** JVM 已用内存 (bytes) */
  used_memory_bytes: number
}

// ─── 实时负载响应 ──────────────────────────────────────────

/** 服务器实时负载数据 */
export type ServerRealtimeLoad = {
  /** CPU 信息 */
  cpu_info: CPUInfo
  /** 服务器显示名称 */
  display_name: string
  /** JVM 信息 */
  jvm_info: JVMInfo
  /** 最后心跳时间戳 (秒) */
  last_heartbeat: number
  /** 物理内存信息 */
  memory_info: MemoryInfo
  /** 是否在线 */
  online: boolean
  /** 服务器 ID */
  server_id: number
  /** 服务器标识名 */
  server_name: string
  /** TPS (Ticks Per Second) */
  tps: number
}

/** 批量实时负载响应 (data 为数组) */
export type ServerRealtimeLoadListResponse = ServerRealtimeLoad[]

// ─── 历史负载响应 ──────────────────────────────────────────

/** 单次负载采样点 */
export type LoadSample = {
  /** 采集时间戳 (秒) */
  collected_at: number
  /** CPU 核心数 */
  cpu_cores: number
  /** CPU 使用率 (%) */
  cpu_usage_pct: number
  /** JVM 最大内存 (bytes) */
  jvm_max_bytes: number
  /** JVM 已用内存 (bytes) */
  jvm_used_bytes: number
  /** 空闲内存 (bytes) */
  mem_free_bytes: number
  /** 总内存 (bytes) */
  mem_total_bytes: number
  /** 已用内存 (bytes) */
  mem_used_bytes: number
  /** TPS */
  tps: number
}

/** 分钟聚合记录 */
export type LoadHistoryRecord = {
  /** CPU 平均使用率 (%) */
  cpu_usage_avg: number
  /** JVM 平均已用内存 (bytes) */
  jvm_used_avg: number
  /** 物理内存平均已用 (bytes) */
  mem_used_avg: number
  /** 分钟时间标识 (如 "2026-05-23T20:55:00") */
  minute_time: string
  /** 该分钟内的原始采样点 */
  samples: LoadSample[]
  /** 平均 TPS */
  tps_avg: number
}

/** 服务器历史负载响应 */
export type ServerLoadHistoryResponse = {
  /** 服务器显示名称 */
  display_name: string
  /** 历史记录列表 (按分钟聚合) */
  records: LoadHistoryRecord[]
  /** 服务器 ID */
  server_id: number
  /** 服务器标识名 */
  server_name: string
}

// ─── 查询参数 ──────────────────────────────────────────────

/** 历史负载查询参数 */
export type ServerLoadHistoryParams = {
  /** 开始时间 (RFC3339) */
  start: string
  /** 结束时间 (RFC3339) */
  end: string
  /** 页码 */
  page?: number
  /** 每页数量 */
  page_size?: number
}
