// import type { HttpContext } from '@adonisjs/core/http'

import ForbiddenException from '#exceptions/forbidden_exception'
import { EmailVerificationService } from '#services/auth/email_verification_service'
import { HTTP_STATUS } from '#types'
import validateRequest from '#utils/database/validate_request'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

@inject()
export default class EmailVerificationsController {
  constructor(protected emailVerificationService: EmailVerificationService) {}
  async request({ response, auth }: HttpContext) {
    const user = await auth.authenticate().catch((err) => {
      console.error(err)
      return
    })
    if (user && user.isVerified) throw new ForbiddenException('You are already verified')
    user &&
      (await this.emailVerificationService.request(user.email).catch((err) => {
        console.error(err)
        return
      }))

    return response.json({ result: true, data: null, message: 'Verification email sent' })
  }

  async verify({ request, auth, response }: HttpContext) {
    const user = await auth.authenticate()
    if (user.isVerified) throw new ForbiddenException('You are already verified')
    const sanitizedParams = await validateRequest(
      request,
      vine.compile(
        vine.object({
          tk: vine.string().fixedLength(10),
        })
      )
    )

    const result = await this.emailVerificationService
      .verify(user.id, sanitizedParams.tk)
      .catch((err) => {
        console.error(err)
        throw new ForbiddenException('Invalid token')
      })

    return response.status(HTTP_STATUS.OK).json({ message: 'Email verified', result, data: null })
  }
}
