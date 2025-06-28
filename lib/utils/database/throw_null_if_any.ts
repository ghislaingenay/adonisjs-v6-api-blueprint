import NotFoundException from '#exceptions/not_found_exception'

export default function throwNullIfAny<T>(data: T | null, message = 'Data is not defined'): T {
  if (data === null) throw new NotFoundException(message)
  return data
}
