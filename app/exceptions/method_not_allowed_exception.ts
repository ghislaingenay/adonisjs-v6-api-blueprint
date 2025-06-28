import { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import { ErrorBody, EXCEPTION_CODE, HTTP_STATUS } from '#types'
import { getErrorBody } from '#utils/http/exceptions'
import app from '@adonisjs/core/services/app'

export default class MethodNotAllowedException extends Exception {
  protected debug = !app.inProduction
  static status = HTTP_STATUS.NOT_ALLOWED
  static code = EXCEPTION_CODE.NOT_ALLOWED
  private static defaultMessage = 'Method not allowed'

  constructor(message?: string) {
    super(message ?? MethodNotAllowedException.defaultMessage, {
      status: MethodNotAllowedException.status,
      code: MethodNotAllowedException.code,
    })
  }

  async handle(err: ErrorBody, ctx: HttpContext) {
    const error = getErrorBody({ ...err, stack: this.stack, message: err.message })
    ctx.response.status(MethodNotAllowedException.status).send(error)
    return
  }
}
