import { FormatPageOptions, Limit, MetaPage, Offset } from '#types'
import { LucidModel } from '@adonisjs/lucid/types/model'

/**
 * Create meta object for pagination
 * @param param0 {page, limit, count}
 * @returns {MetaPage} MetaPage
 */
export const getMeta = ({
  page,
  limit,
  count,
}: Record<'page' | 'limit' | 'count', number>): MetaPage => {
  try {
    return {
      limit,
      page,
      total: count,
      pages: Math.ceil(count / limit),
    }
  } catch (err) {
    throw new TypeError('Error with getting meta')
  }
}
/**
 * Get limit and offset for pagination
 * @param page page number
 * @param limit results per page
 * @param options Set defaults or results per page
 * @returns  {[Limit, Offset]} [pageRows, startRow] as [Limit, Offset]
 */
export const getLimitOffset = (
  page?: number,
  limit?: number,
  options?: FormatPageOptions
): [Limit, Offset] => {
  const { defaultPage = 1, defaultResults = 20 } = options || {}
  page = Number(page) || defaultPage
  limit = Number(limit) || defaultResults
  const pageRows = limit
  const startRow = pageRows * (page - 1)
  return [pageRows, startRow] as [Limit, Offset]
}

export const getMetaORM = async (params: {
  page: number
  limit: number
  schema: LucidModel
  sql: string
}): Promise<MetaPage> => {
  const [{ count }] = (await params.schema
    .query()
    .from(params.sql)
    .count('*', 'count')) as unknown as { count: number }[]
  return getMeta({ page: params.page, limit: params.limit, count })
}
