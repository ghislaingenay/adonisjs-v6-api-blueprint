// import BadRequestException from '#exceptions/bad_request_exception'
import InternalServerException from '#exceptions/internal_server_error_exception'
import { Identifier, Try } from '#types'
import { DateTime } from 'luxon'

type Options = {
  defaultMessage?: string
}

export async function tryCatch<T>(
  callback: () => Promise<Try<T>>,
  options?: Options
): Promise<Try<T>> {
  try {
    return (await callback()) as Try<T>
  } catch (err) {
    if (options?.defaultMessage) return [null, new InternalServerException(options?.defaultMessage)]
    return [null, err]
  }
}

/**
 * Verify if two date ranges are intertwined and have at least one period in common
 * @param {[Date, Date]} current Current date range already in place
 * @param {[Date, Date]}  newElement New Date range to compare with current Date range
 * @description Function used to check availability of a date range
 * @returns {boolean} Return true if the two date ranges are intertwined
 */
export const isTwoDateRangeIntertwine = (
  current: [DateTime, DateTime],
  newElement: [DateTime, DateTime]
): boolean => {
  const [[currStart, currEnd], [newStart, newEnd]] = [current, newElement]
  const isIntertwineOne = newStart >= currStart && newStart <= currEnd && newEnd >= currEnd
  const isIntertwineTwo = newEnd >= currStart && newEnd <= currEnd && newStart <= currStart
  const isIntertwineThree = isDateRangeNested(current, newElement)
  const isIntertwineFour = newStart <= currStart && newEnd >= currEnd
  return isIntertwineOne || isIntertwineTwo || isIntertwineThree || isIntertwineFour
}

/**
 * Verify if a date range is nested inside another date range
 * @param {[DateTime, DateTime]} current Higher Date range [start, end]
 * @param {[DateTime, DateTime]} newElement Date range nested inside the current Date range [start, end]
 * @returns {boolean} Return true if newElement is nested inside are intertwined
 */
export const isDateRangeNested = (
  current: [DateTime, DateTime],
  newElement: [DateTime, DateTime]
): boolean => {
  const [[currStart, currEnd], [newStart, newEnd]] = [current, newElement]
  return newStart >= currStart && newEnd <= currEnd
}

export const getIdentifier = <T extends string>(identifier: T | null): string => {
  if (!identifier) throw new Error('Invalid identifier')
  // if (!identifier) throw new BadRequestException('Invalid identifier')
  return identifier.split(':')[1]
}

export const getIdentifierType = (identifier: Identifier): 'slug' | 'id' => {
  return Number.isNaN(Number(identifier)) ? 'slug' : 'id'
}

/** Set the hash map with the primary key and the data
 * @returns {Record<string, T>} Return the hash map with the primary key and the data
 */
export const setHashMemo = <T>(pk: keyof T, data: T[]): Record<Identifier, T> => {
  const memo = {} as Record<Identifier, T>
  for (const item of data) {
    const element = String(item[pk] as number | string)
    // takes the latest item all the time => like avoid duplicates
    memo[element] = item
  }
  return memo
}

/** Set the hash map with the primary key and the data
 * @returns {Record<string, T[]>} Return the hash map with the primary key and the data
 */
export const setHashMemoArray = <T>(pk: keyof T, data: T[]): Record<Identifier, T[]> => {
  const memo: Record<Identifier, T[]> = {}
  for (const item of data) {
    const element = String(item[pk] as number | string)
    if (!memo.hasOwnProperty(element)) memo[element].push(item)
    else memo[element] = [item]
  }
  return memo
}
