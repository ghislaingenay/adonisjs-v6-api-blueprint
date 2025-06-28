import vine from '@vinejs/vine'

export const updateUserObject = vine.object({
  fullName: vine.string().maxLength(254).optional(),
  profilePicture: vine.string().url().optional(),
})

export const updateUserCompiler = vine.compile(updateUserObject)
