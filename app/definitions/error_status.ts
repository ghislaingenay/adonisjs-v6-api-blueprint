import BadRequestException from '#exceptions/bad_request_exception'
import ForbiddenException from '#exceptions/forbidden_exception'
import NotFoundException from '#exceptions/not_found_exception'
import UnAuthorizedException from '#exceptions/un_authorized_exception'
import { HTTP_STATUS, HttpStatus } from '#types'

class ErrorStatus {
  httpStatus: HTTP_STATUS
  constructor(err?: Error) {
    this.httpStatus = err ? this.getErrorStatus(err) : HTTP_STATUS.INTERNAL_SERVER_ERROR
  }

  private getErrorStatus(err: Error): HTTP_STATUS {
    if (err instanceof NotFoundException) return HTTP_STATUS.NOT_FOUND
    if (err instanceof BadRequestException) return HTTP_STATUS.BAD_REQUEST
    if (err instanceof TypeError) return HTTP_STATUS.BAD_REQUEST
    if (err instanceof SyntaxError) return HTTP_STATUS.BAD_REQUEST
    if (err instanceof ForbiddenException) return HTTP_STATUS.FORBIDDEN
    if (err instanceof UnAuthorizedException) return HTTP_STATUS.UNAUTHORIZED
    return HTTP_STATUS.INTERNAL_SERVER_ERROR
  }

  set(err: Error) {
    this.httpStatus = Number(this.getErrorStatus(err)) as HTTP_STATUS
    return this
  }

  get status() {
    return {
      get: () => {
        return this.httpStatus
      },
      stringify: () => {
        return this.httpStatus.toString() as HttpStatus
      },
    }
  }

  get isNotFound() {
    return this.status.get() === HTTP_STATUS.NOT_FOUND
  }

  get isBadRequest() {
    return this.status.get() === HTTP_STATUS.BAD_REQUEST
  }

  get isForbidden() {
    return this.status.get() === HTTP_STATUS.FORBIDDEN
  }

  get isUnAuthorized() {
    return this.status.get() === HTTP_STATUS.UNAUTHORIZED
  }

  get isServerError() {
    return this.status.get() === HTTP_STATUS.INTERNAL_SERVER_ERROR
  }
}

const errorStatus = new ErrorStatus()
export default errorStatus
export type { ErrorStatus }
