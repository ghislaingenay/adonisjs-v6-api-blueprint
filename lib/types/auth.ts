import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
} from '#validators/auth'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import { Infer } from '@vinejs/vine/types'

export type UserRegistration = Infer<typeof registerValidator>
export type UserLogin = Infer<typeof loginValidator>

export enum AuthGuards {
  API = 'api',
  ADMIN = 'admin',
}

export type Auth = Authenticator<Authenticators>
export type AuthUser = Auth['user']

export type VerifyEmailDto = Infer<typeof verifyEmailValidator>
export type ForgotPasswordDto = Infer<typeof forgotPasswordValidator>
export type ResetPasswordDto = Infer<typeof resetPasswordValidator>
