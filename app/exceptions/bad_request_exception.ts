import { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import { ErrorBody, EXCEPTION_CODE, HTTP_STATUS } from '#types'
import { getErrorBody } from '#utils/http/exceptions'
import app from '@adonisjs/core/services/app'

export default class BadRequestException extends Exception {
  protected debug = !app.inProduction
  static status = HTTP_STATUS.BAD_REQUEST
  static code = EXCEPTION_CODE.BAD_REQUEST
  private static defaultMessage = 'Bad request'

  constructor(message?: string) {
    super(message ?? BadRequestException.defaultMessage, {
      status: BadRequestException.status,
      code: BadRequestException.code,
    })
  }

  async handle(err: ErrorBody, ctx: HttpContext) {
    const error = getErrorBody({ ...err, stack: this.stack, message: err.message })
    ctx.response.status(BadRequestException.status).send(error)
    return
  }
}
