import type { BuilderQuery } from '#types'
import isStringNumber from './is_string_number.js'

export const convertSqlBuilderToRaw = (buildQuery: BuilderQuery<unknown>): string => {
  return buildQuery.toSQL().sql
}

export const checkValidSlug = (slug: string): string => {
  if (!slug) throw new Error('Invalid slug')
  const isValidSlug = !isStringNumber(slug)
  if (!isValidSlug) throw new Error('Invalid slug')
  // if (!slug) throw new BadRequestException('Invalid slug')
  // const isValidSlug = !isStringNumber(slug)
  // if (!isValidSlug) throw new ValidationException('Invalid slug')
  return slug
}

export const fillValueWithZeros = (value: number, length: number) => {
  const str = String(value)
  const array = Array(length).fill(0)
  for (let i = array.length - 1; i >= 0; i--) {
    if (str[i] === undefined) break
    if (str[i] !== undefined) array[i] = str[i]
  }
  return array.join('')
}

/** Doesn't includes where in the statement */
export const getWhereSql = (where: string[]): string => {
  return where.length ? `${where.join(' AND ')}` : ''
}

type WhereIn =
  | {
      data: string[]
      type: 'string'
    }
  | {
      data: null
      type: null
    }
  | {
      type: 'number'
      data: number[]
    }

export const formatWhereIn = (value: string): WhereIn => {
  const nullResponse = { data: null, type: null }
  if (!value) return nullResponse
  if (!value.trim()) return nullResponse
  const splitted = value.split(',')
  if (splitted.length === 1) {
    if (isStringNumber(splitted[0]))
      return { data: splitted.map((val) => Number(val)), type: 'number' }
    return { data: splitted, type: 'string' }
  }
  const areOnlyNumbers = splitted.every(isStringNumber)
  if (areOnlyNumbers) return { data: splitted.map(Number), type: 'number' }
  return { data: splitted, type: 'string' }
}
