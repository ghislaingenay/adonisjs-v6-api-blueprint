import UnAuthorizedException from '#exceptions/un_authorized_exception'
import ValidationException from '#exceptions/unprocessable_entity_exception'
import { AuthService } from '#services/auth_service'
import { HTTP_STATUS, HttpResponse, UserRegistration } from '#types'
import { loginValidator, registerValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {
  constructor(protected authService: AuthService) {}

  async registerWithPassword({ request, response }: HttpContext) {
    const payload: UserRegistration = await request
      .validateUsing(registerValidator)
      .catch((error) => {
        throw new ValidationException(error)
      })
    const data = await this.authService.registerWithPassword({ ...payload, provider: 'password' })
    return response.status(HTTP_STATUS.CREATED).json({
      ...data,
      data: true,
    } as HttpResponse<true>)
  }

  async loginWithPassword({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator).catch((error) => {
      throw new ValidationException(error)
    })
    const data = await this.authService.loginWithPassword(payload)
    return response.status(HTTP_STATUS.CREATED).json(data)
  }

  async getCurrentUser({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      return response
        .status(HTTP_STATUS.OK)
        .json({ data: user.serialize(), message: '', result: true })
    } catch (error) {
      throw new UnAuthorizedException()
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    console.log(
      'user.currentAccessToken.value',
      user.currentAccessToken.value,
      user.currentAccessToken.identifier
    )
    await this.authService.deleteToken(user, user.currentAccessToken.identifier as string)
    return response.status(HTTP_STATUS.OK).json({ result: true, data: null, message: 'logout' })
  }
}
