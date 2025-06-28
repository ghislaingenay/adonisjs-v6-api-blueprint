import InternalServerException from '#exceptions/internal_server_error_exception'
import NotFoundException from '#exceptions/not_found_exception'
import { Identifier } from '#types'
import { LucidModel } from '@adonisjs/lucid/types/model'

export default async function findByIdentifier<T = LucidModel>(
  model: LucidModel,
  identifier: Identifier,
  messages?: {
    notFound?: string
    internalError?: string
  }
): Promise<T> {
  try {
    const response =
      typeof identifier === 'number'
        ? await model.find(identifier)
        : await model.findBy('slug', identifier)
    if (!response) throw new NotFoundException(messages?.notFound ?? 'Item not found')
    return response as T
  } catch (err) {
    throw new InternalServerException(messages?.internalError ?? 'Server Error')
  }
}
