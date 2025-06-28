import BadRequestException from '#exceptions/bad_request_exception'
import ForbiddenException from '#exceptions/forbidden_exception'
import InternalServerException from '#exceptions/internal_server_error_exception'
import NotFoundException from '#exceptions/not_found_exception'
import type {
  ErrorBody,
  ErrorResponse,
  GetErrorOptions,
  TryResponse,
  ValidationError,
} from '#types'

/**
 * Get error body
 * @param error Exception Error
 * @returns body of the error
 * @description This function returns the body of the error. Add stack if debug is activated
 */
export const getErrorBody = (error: ErrorBody): ErrorResponse => {
  const { debug, stack, name, ...rest } = error
  if (debug) return { ...rest, stack, name }
  return { ...rest }
}

export const getValidatorErrorMessage = (
  error: ValidationError,
  options?: { showAll?: boolean }
): string => {
  const show = options?.showAll ?? true
  const defaultMessage = 'Validation error'
  if (!error) throw new TypeError('No error in validation error')
  if (!error.messages.length) return defaultMessage
  if (show) return JSON.stringify(error.messages.map(({ message }) => message).join('/ '))
  return error.messages[0]?.message ?? defaultMessage
}

const getErrorMessageFromError = (error: unknown): string | undefined => (error as Error).message
// const getAxiosErrorMessage = (error: AxiosError<any, any>): string | undefined =>
//   error.response?.data.message

export const getError = (err: unknown, options?: GetErrorOptions): Error => {
  const { isFetch = true } = options || {}
  // const errorMessage = useAxios
  //   ? getAxiosErrorMessage(err as AxiosError)
  //   : getErrorMessageFromError(err as Error)
  const errorMessage = getErrorMessageFromError(err as Error)
  if (err instanceof NotFoundException) return new NotFoundException(errorMessage)
  if (err instanceof BadRequestException) return new BadRequestException(errorMessage)
  if (err instanceof TypeError) return new TypeError(errorMessage)
  if (err instanceof SyntaxError) return new SyntaxError(errorMessage)
  if (err instanceof ForbiddenException) return new ForbiddenException(errorMessage)
  if (err instanceof ForbiddenException) return new ForbiddenException(errorMessage)
  // if (err instanceof StripeException) return err
  if (isFetch) return new InternalServerException(options?.default_message ?? errorMessage)
  return new Error(options?.default_message ?? errorMessage)
}

/** Get error TryResponse format
 * Consider using this functio
 */
export const tryErrorResponse = (err: Error, message?: string): TryResponse<any> => {
  const error = getError(err, message ? { default_message: message } : {})
  return [null, error]
}
