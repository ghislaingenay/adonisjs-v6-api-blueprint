import ValidationException from '#exceptions/unprocessable_entity_exception'
import { Request } from '@adonisjs/core/http'
import { VineValidator } from '@vinejs/vine'
import { Infer, SchemaTypes } from '@vinejs/vine/types'

export default async function validateRequest<
  Schema extends SchemaTypes,
  Metadata extends Record<string, any> | undefined,
>(req: Request, validation: VineValidator<Schema, Metadata>): Promise<Infer<Schema>> {
  return await req.validateUsing(validation as any).catch((error) => {
    throw new ValidationException(error)
  })
}
