import UnAuthorizedException from '#exceptions/un_authorized_exception'
import type { Authenticators } from '@adonisjs/auth/types'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export type SupabaseAuth = {
  id: string
  accessToken: string
  email: string
}

declare module '@adonisjs/auth/types' {
  interface Authenticator {
    supabase?: SupabaseAuth
  }
}
/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
      // supabase?: boolean
    } = {
      // supabase: true,
    }
  ) {
    // check supabase token

    // let haveVerifyToken = false
    // const supabaseToken = ctx.request.header('X-Auth-Token')
    // if (options.supabase) {
    //   const payload = AuthService.verifyJwtToken(supabaseToken)
    //   if (!payload) {
    //     // signout jwt token for supabase
    //     await connector.auth.admin.signOut(supabaseToken as string)
    //     throw new UnAuthorizedException()
    //   }
    //   // ;(ctx.auth as any).supabase = {
    //   //   id: payload.,
    //   //   accessToken: supabaseToken,
    //   //   email: payload.email,
    //   // }
    // }
    // verify user
    await ctx.auth
      .authenticateUsing(options.guards, { loginRoute: this.redirectTo })
      .catch(async () => {
        // signout jwt token for supabase
        // if (options.supabase) {
        //   await connector.auth.admin.signOut(supabaseToken as string)
        // }
        throw new UnAuthorizedException()
      })

    await next()

    // if (!haveVerifyToken) {
    // reject user if the supabase token is not valid
    // await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    // throw new UnAuthorizedException()
  }
}
