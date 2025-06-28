import InternalServerException from '#exceptions/internal_server_error_exception'
import db from '@adonisjs/lucid/services/db'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

import BadRequestException from '#exceptions/bad_request_exception'
import { WithTransaction } from '#types'
import { getError } from '#utils/http/exceptions'

type Options = {
  defaultMessage?: string
}

export default async function updateEntity<T, K = unknown>(
  model: T,
  body: Partial<K>,
  options?: Options
) {
  let trx: TransactionClientContract
  try {
    trx = await db.transaction()
  } catch (error) {
    throw new BadRequestException('Failed to create a transaction')
  }
  try {
    const updated = await (model as any)
      .useTransaction(trx)
      .merge(body)
      .save()
      .catch(() => {
        const errorMessage = options?.defaultMessage ?? 'Failed to update the model'
        throw new InternalServerException(errorMessage)
      })
    return { data: updated, trx } as WithTransaction<T>
  } catch (error) {
    console.error('Error updating model:', error)
    throw getError(error)
  }
}
