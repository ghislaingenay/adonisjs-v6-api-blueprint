import InternalServerException from '#exceptions/internal_server_error_exception'
import db from '@adonisjs/lucid/services/db'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

import BadRequestException from '#exceptions/bad_request_exception'
import { WithTransaction } from '#types'

type Options = {
  defaultMessage?: string
}

export default async function createEntity<T, K = unknown>(model: T, body: K, options?: Options) {
  let trx: TransactionClientContract
  try {
    trx = await db.transaction()
  } catch (error) {
    throw new BadRequestException('Failed to create a transaction')
  }
  const response = await (model as any).create(body, { client: trx }).catch((err: any) => {
    console.error(err)
    throw new InternalServerException(options?.defaultMessage ?? 'Failed to create entity')
  })
  return { data: response, trx } as WithTransaction<K>
}
