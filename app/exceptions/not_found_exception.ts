import { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import { ErrorBody, EXCEPTION_CODE, HTTP_STATUS } from '#types'
import app from '@adonisjs/core/services/app'
import { getErrorBody } from '#utils/http/exceptions'

export default class NotFoundException extends Exception {
  protected debug = !app.inProduction
  static status = HTTP_STATUS.NOT_FOUND
  static code = EXCEPTION_CODE.NOT_FOUND
  private static defaultMessage = 'Not found'

  constructor(message?: string) {
    super(message ?? NotFoundException.defaultMessage, {
      status: NotFoundException.status,
      code: NotFoundException.code,
    })
  }

  async handle(err: ErrorBody, ctx: HttpContext) {
    const error = getErrorBody({ ...err, stack: this.stack, message: err.message })
    ctx.response.status(NotFoundException.status).send(error)
    return
  }
}
