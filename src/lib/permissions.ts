import type { RoleName } from '#/api/types'

export const ADMIN_ROLES: readonly RoleName[] = ['ADMIN', 'SUPER_ADMIN'] as const

export const SUPER_ADMIN_ONLY: readonly RoleName[] = ['SUPER_ADMIN'] as const

export function isAdmin(role: RoleName | undefined): boolean {
  return ADMIN_ROLES.includes(role!)
}

export function isSuperAdmin(role: RoleName | undefined): boolean {
  return role === 'SUPER_ADMIN'
}
