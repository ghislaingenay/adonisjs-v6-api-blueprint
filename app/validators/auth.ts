import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().maxLength(254),
    email: vine
      .string()
      .email()
      .unique(async (query, field) => {
        const user = await query.from('users').where('email', field).first()
        return !user
      }),
    password: vine.string().minLength(8).maxLength(32),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32),
  })
)

export const verifyEmailSchema = vine.object({
  code: vine.string().fixedLength(6),
  token: vine.string().minLength(10).maxLength(32),
})

export const verifyEmailValidator = vine.compile(verifyEmailSchema)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    otp: vine.string().fixedLength(6),
    token: vine.string().maxLength(32),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string().maxLength(40),
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32),
  })
)

export const sendEmailOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)
