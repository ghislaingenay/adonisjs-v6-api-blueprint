import { createRoleValidator } from '#validators/role'
import { updateUserCompiler } from '#validators/user'
import { Infer } from '@vinejs/vine/types'

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  EMPLOYEE = 'EMPLOYEE',
}

export enum RoleKey {
  Admin = 'admin',
  Customer = 'customer',
  Ceo = 'ceo',
  Manager = 'manager',
  Employee = 'employee',
}

export type CreateRoleDto = Infer<typeof createRoleValidator>

export type GetUserList = {
  id?: number
  // role?: UserRole
  isVerified?: boolean
  email?: string
  mobile?: string
}

export type UpdateUserDto = Infer<typeof updateUserCompiler>
