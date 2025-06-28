import { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import { ErrorBody, EXCEPTION_CODE, HTTP_STATUS } from '#types'
import { getErrorBody } from '#utils/http/exceptions'
import app from '@adonisjs/core/services/app'

export default class InternalServerException extends Exception {
  protected debug = !app.inProduction
  static status = HTTP_STATUS.INTERNAL_SERVER_ERROR
  static code = EXCEPTION_CODE.INTERNAL_SERVER_ERROR
  private static defaultMessage = 'Internal Server Error'

  constructor(message?: string) {
    super(message ?? InternalServerException.defaultMessage, {
      status: InternalServerException.status,
      code: InternalServerException.code,
    })
  }

  async handle(err: ErrorBody, ctx: HttpContext) {
    const error = getErrorBody({ ...err, stack: this.stack, message: err.message })
    ctx.response.status(InternalServerException.status).send(error)
    return
  }
}
