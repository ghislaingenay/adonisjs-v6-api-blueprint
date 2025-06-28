import vine from '@vinejs/vine'

export const creteRoleObject = vine.object({
  name: vine.string().maxLength(100),
  description: vine.string().maxLength(200).optional(),
  key: vine
    .string()
    .maxLength(50)
    .unique(async (query, field) => {
      const role = await query.from('roles').where('key', field).first()
      return !role
    }),
})

export const createRoleValidator = vine.compile(creteRoleObject)
