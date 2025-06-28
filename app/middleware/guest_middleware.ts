import ForbiddenException from '#exceptions/forbidden_exception'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class GuestMiddleware {
  async handle({ auth }: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const isAuthenticated = await auth.check()
    // const supabaseToken = request.header('X-Auth-Token')
    // let payload = null
    // payload = AuthService.verifyJwtToken(supabaseToken)
    if (isAuthenticated) throw new ForbiddenException('Not authorized to access this route')
    // if (isAuthenticated) {
    //   return response.status(HTTP_STATUS.FORBIDDEN).json({
    //     result: false,
    //     redirectTo: '/',
    //     message: 'You are already logged in',
    //   })
    // }
    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
