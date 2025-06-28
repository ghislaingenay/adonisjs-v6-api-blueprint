/* eslint-disable @typescript-eslint/naming-convention */
export enum EXCEPTION_CODE {
  UNAUTHORIZED = 'E_UNAUTHORIZED',
  FORBIDDEN = 'E_FORBIDDEN',
  NOT_FOUND = 'E_NOT_FOUND',
  OK = 'E_OK',
  CREATED = 'E_CREATED',
  BAD_REQUEST = 'E_BAD_REQUEST',
  NOT_ALLOWED = 'E_NOT_ALLOWED',
  LENGTH_REQUIRED = 'E_LENGTH_REQUIRED',
  INTERNAL_SERVER_ERROR = 'E_INTERNAL_SERVER_ERROR',
  UNPROCESSABLE_ENTITY = 'E_VALIDATION_ERROR',
}

export enum HTTP_STATUS {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NO_CONTENT = 204,
  NOT_FOUND = 404,
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_ALLOWED = 405,
  UNPROCESSABLE_ENTITY = 422,
  LENGTH_REQUIRED = 411,
  INTERNAL_SERVER_ERROR = 500,
  TOO_MANY_REQUEST = 429,
  REQUEST_FAILED = 424,
}

export type HttpStatus = '404' | '400' | '403' | '401' | '500' | '422' | '411' | '429' | '424'

export interface ErrorBody {
  code: EXCEPTION_CODE
  status: HTTP_STATUS
  message: string
  debug: boolean
  name?: string
  stack?: string
}

export type ErrorResponse = Omit<ErrorBody, 'debug'>

// HTTP/1.1 200 OK
// Content-Type: application/json
// Content-Length: 123
// Cache-Control: max-age=3600

type ValidationItem = { message: string; field: string; rule: string }

export type ValidationError = {
  status: HTTP_STATUS.UNPROCESSABLE_ENTITY
  code: EXCEPTION_CODE.UNPROCESSABLE_ENTITY
  messages: ValidationItem[]
}

export type HandlerError = {
  status: HTTP_STATUS
  code: EXCEPTION_CODE
  redirectTo: '/login'
  identifier: `errors.${EXCEPTION_CODE}`
  guardDriverName: 'access_tokens'
  renderers?: Record<'session' | 'basic_auth' | 'access_tokens', Function>
}

export type GetErrorOptions = {
  isFetch?: boolean
  default_message?: string
}
