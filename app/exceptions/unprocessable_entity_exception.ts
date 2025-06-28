import { ErrorBody, EXCEPTION_CODE, HTTP_STATUS, ValidationError } from '#types'
import { getErrorBody, getValidatorErrorMessage } from '#utils/http/exceptions'
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class ValidationException extends Exception {
  protected debug = !app.inProduction
  static status = HTTP_STATUS.UNPROCESSABLE_ENTITY
  static code = EXCEPTION_CODE.UNPROCESSABLE_ENTITY

  constructor(error: ValidationError | string, showAll?: boolean) {
    if (typeof error === 'string') {
      super(error, {
        status: ValidationException.status,
        code: ValidationException.code,
      })
      return
    }
    const message = getValidatorErrorMessage(error, { showAll })
    super(message, {
      status: ValidationException.status,
      code: ValidationException.code,
    })
  }

  async handle(err: ErrorBody, ctx: HttpContext) {
    const error = getErrorBody({ ...err, stack: this.stack, message: err.message })
    ctx.response.status(ValidationException.status).send(error)
    return
  }
}

export class UnProcessableEntityException extends ValidationException {
  constructor(error: ValidationError | string, showAll?: boolean) {
    super(error, showAll)
  }
}
