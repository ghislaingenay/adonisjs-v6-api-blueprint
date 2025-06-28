import { FormatPageOptions, Limit, Offset } from '#types'

/**
 * Get limit and offset for pagination
 * @param page page number
 * @param limit results per page
 * @param options Set defaults or results per page
 * @returns  {[Limit, Offset]} [pageRows, startRow] as [Limit, Offset]
 */
const getLimitOffset = (
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

export default getLimitOffset
