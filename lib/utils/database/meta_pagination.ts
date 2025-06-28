import BadRequestException from '#exceptions/bad_request_exception'
import { LucidMetaPage, MetaPage, WithLucidMeta, WithMeta } from '#types'
import { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

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

export const getMetaPagination = (
  { total, perPage }: LucidMetaPage,
  { page, limit }: Record<'page' | 'limit', number>
): MetaPage => {
  const resultsPerPage = perPage ?? limit
  return {
    limit: resultsPerPage,
    page,
    total: total,
    pages: !total ? 0 : Math.ceil(total / resultsPerPage),
  }
}

export const returnWithMeta = <T>(
  data: WithLucidMeta<T>,
  pagination: Record<'page' | 'limit', number>
): WithMeta<T> => {
  return { data: data.data, meta: getMetaPagination(data.meta, pagination) }
}

export async function paginate<T = LucidModel>(
  builder: ModelQueryBuilderContract<any, T>,
  { page, limit }: Record<'page' | 'limit', number>
): Promise<WithMeta<T[]>> {
  try {
    const response = await builder.paginate(page, limit).then((data) => {
      return data.toJSON() as WithLucidMeta<T[]>
    })
    return returnWithMeta<T[]>(response, { page, limit })
  } catch (err) {
    console.error('Error in paginate:', err)
    throw new BadRequestException('Unable to paginate')
  }
}
