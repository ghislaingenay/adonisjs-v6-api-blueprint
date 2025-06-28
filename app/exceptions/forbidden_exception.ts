import { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import { ErrorBody, EXCEPTION_CODE, HTTP_STATUS } from '#types'
import { getErrorBody } from '#utils/http/exceptions'
import app from '@adonisjs/core/services/app'

export default class ForbiddenException extends Exception {
  protected debug = !app.inProduction
  static status = HTTP_STATUS.FORBIDDEN
  static code = EXCEPTION_CODE.FORBIDDEN
  private static defaultMessage = 'Forbidden access'

  constructor(message?: string) {
    super(message ?? ForbiddenException.defaultMessage, {
      status: ForbiddenException.status,
      code: ForbiddenException.code,
    })
  }

  async handle(err: ErrorBody, ctx: HttpContext) {
    const error = getErrorBody({ ...err, stack: this.stack, message: err.message })
    ctx.response.status(ForbiddenException.status).send(error)
    return
  }
}
