import db from '@adonisjs/lucid/services/db'

/**
 * Get count from the db from an sql query
 * @param primaryKey Primary key from teh db with the specific table
 * @param sql sql query to get the count
 * @returns {number} count
 * @throws {InternalServerException} Error with getting count
 * @throws {TypeError} Primary key must be a string
 */
const getCount = async (primaryKey: string, sql: string): Promise<number> => {
  if (typeof primaryKey !== 'string') throw new TypeError('Primary key must be a string')
  try {
    const data = await db
      .rawQuery(`SELECT COUNT("q"."${primaryKey}") as "count" FROM (${sql}) as "q"`)
      .exec()
      .catch((err) => {
        console.error(err)
        throw new Error('Error with getting count')
        // throw new InternalServerException('Error with getting count')
      })

    const rows = data.rows as { count: number }[]
    return Number(rows[0].count ?? 0)
  } catch (err) {
    throw new Error('Error with getting count')
    // if (!(err instanceof InternalServerException))
    //   throw getError(err, { default_message: 'Error with getting count' })
    // throw err
  }
}

export default getCount
