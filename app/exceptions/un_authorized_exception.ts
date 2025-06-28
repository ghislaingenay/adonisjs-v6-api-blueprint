import { ErrorBody, EXCEPTION_CODE, HTTP_STATUS } from '#types'
import { getErrorBody } from '#utils/http/exceptions'
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class UnAuthorizedException extends Exception {
  protected debug = !app.inProduction
  static status = HTTP_STATUS.UNAUTHORIZED
  static code = EXCEPTION_CODE.UNAUTHORIZED
  private static defaultMessage = 'Unauthorized access'

  constructor(message?: string) {
    super(message ?? UnAuthorizedException.defaultMessage, {
      status: UnAuthorizedException.status,
      code: UnAuthorizedException.code,
    })
  }

  async handle(error: ErrorBody, ctx: HttpContext) {
    ctx.response
      .status(UnAuthorizedException.status)
      .send(getErrorBody({ ...error, stack: this.stack, message: error.message }))
    return
  }
}
