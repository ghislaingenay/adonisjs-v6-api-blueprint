import {
  EXCEPTION_CODE,
  ErrorBody,
  HTTP_STATUS,
  RESEND_ERROR_CODE,
  ResendErrorRecord,
} from '#types'
import { getErrorBody } from '#utils/http/exceptions'
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { ErrorResponse } from 'resend'

const resendRecord: ResendErrorRecord = {
  invalid_access: {
    code: 'E_EMAIL_INVALID_ACCESS',
    apiStatus: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    status: HTTP_STATUS.FORBIDDEN,
  },
  invalid_parameter: {
    code: 'E_EMAIL_INVALID_PARAMETER',
    apiStatus: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    status: HTTP_STATUS.BAD_REQUEST,
  },
  invalid_region: {
    code: 'E_EMAIL_INVALID_REGION',
    apiStatus: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    status: HTTP_STATUS.BAD_REQUEST,
  },
  validation_error: {
    code: 'E_EMAIL_VALIDATION_ERROR',
    apiStatus: HTTP_STATUS.FORBIDDEN,
    status: HTTP_STATUS.FORBIDDEN,
  },
  missing_required_field: {
    code: 'E_EMAIL_MISSING_REQUIRED_FIELD',
    apiStatus: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  },
  invalid_attachment: {
    code: 'E_EMAIL_INVALID_ATTACHMENT',
    apiStatus: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    status: HTTP_STATUS.BAD_REQUEST,
  },
  missing_api_key: {
    code: 'E_EMAIL_MISSING_API_KEY',
    apiStatus: HTTP_STATUS.UNAUTHORIZED,
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  },
  invalid_api_key: {
    code: 'E_EMAIL_INVALID_API_KEY',
    apiStatus: HTTP_STATUS.UNAUTHORIZED,
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  },

  invalid_from_address: {
    code: 'E_EMAIL_INVALID_FROM_ADDRESS',
    apiStatus: HTTP_STATUS.FORBIDDEN,
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  },
  invalid_to_address: {
    code: 'E_EMAIL_INVALID_TO_ADDRESS',
    apiStatus: HTTP_STATUS.FORBIDDEN,
    status: HTTP_STATUS.FORBIDDEN,
  },
  not_found: {
    code: 'E_EMAIL_NOT_FOUND',
    apiStatus: HTTP_STATUS.NOT_FOUND,
    status: HTTP_STATUS.NOT_FOUND,
  },
  method_not_allowed: {
    code: 'E_EMAIL_METHOD_NOT_ALLOWED',
    apiStatus: HTTP_STATUS.NOT_ALLOWED,
    status: HTTP_STATUS.NOT_ALLOWED,
  },
  invalid_scope: {
    code: 'E_EMAIL_INVALID_SCOPE',
    apiStatus: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  },
  daily_quota_exceeded: {
    code: 'E_EMAIL_QUOTA_EXCEEDED',
    apiStatus: HTTP_STATUS.TOO_MANY_REQUEST,
    status: HTTP_STATUS.TOO_MANY_REQUEST,
  },
  rate_limit_exceeded: {
    code: 'E_EMAIL_RATE_EXCEEDED',
    apiStatus: HTTP_STATUS.REQUEST_FAILED,
    status: HTTP_STATUS.REQUEST_FAILED,
  },
  internal_server_error: {
    code: 'E_EMAIL_INTERNAL_SERVER_ERROR',
    apiStatus: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  },
  application_error: {
    code: 'E_EMAIL_APPLICATION_ERROR',
    apiStatus: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  },
}

export default class ResendException extends Exception {
  protected debug = !app.inProduction
  static status = HTTP_STATUS.BAD_REQUEST
  static code = EXCEPTION_CODE.BAD_REQUEST

  constructor(error: ErrorResponse) {
    const codeName = error.name as RESEND_ERROR_CODE
    super(error.message, {
      status: resendRecord[codeName].status,
      code: resendRecord[codeName].code ?? EXCEPTION_CODE.INTERNAL_SERVER_ERROR,
    })
  }

  async handle(err: ErrorBody, ctx: HttpContext) {
    const error = getErrorBody({ ...err, stack: this.stack, message: err.message })
    ctx.response.status(ResendException.status).send(error)
    return
  }
}
