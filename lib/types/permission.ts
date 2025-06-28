import User from '#models/user'
import { LucidModel } from '@adonisjs/lucid/types/model'
import { UserRole } from './users.js'

type PermissionPayload<T extends LucidModel> = {
  action: 'view' | 'create' | 'update' | 'delete'
  dataType: T
}

export type Role = UserRole
// type UserBasedRole = {
//   blockedBy: number[]
//   roles: UserRole[]
// }

export type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]['dataType']) => boolean)

export type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: {
      [Action in Permissions[Key]['action']]: PermissionCheck<Key>
    }
  }>
}

export type PermissionObject = {
  [key: string]: PermissionPayload<LucidModel>
}

export type Permissions = {
  // projects: {
  //   dataType: EmailProject
  //   action: 'create' | 'read' | 'update' | 'delete'
  // }
}

const ROLES = {
  [UserRole.ADMIN]: {
    projects: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  },
  [UserRole.USER]: {
    projects: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  },
  [UserRole.EMPLOYEE]: {
    projects: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  },
} as const satisfies RolesWithPermissions

export function hasPermission<Resource extends keyof Permissions>(
  user: User & { roles: Role[] },
  resource: Resource,
  action: Permissions[Resource]['action'],
  data?: Permissions[Resource]['dataType']
): boolean {
  return user.roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action]
    if (permission === null) return false
    if (typeof permission === 'boolean') return permission
    return data && typeof permission === 'function' && permission(user, data)
  })
}
