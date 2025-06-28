import UnAuthorizedException from '#exceptions/un_authorized_exception'
import { OwnerOnboardingService } from '#services/owner_onboarding_service'
import { HTTP_STATUS, UserLogin, UserRegistration } from '#types'
import validateRequest from '#utils/database/validate_request'
import { loginValidator, registerValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthOwnerController {
  async registerWithPassword({ request, response }: HttpContext) {
    const payload: UserRegistration = await validateRequest(request, registerValidator)
    const ownerOnboardingService = new OwnerOnboardingService()
    const res = await ownerOnboardingService.registerOwner(payload)
    return response.status(HTTP_STATUS.CREATED).json({
      data: res,
      message: 'Account created. Please login to continue',
    })
  }

  async loginWithPassword({ request, response }: HttpContext) {
    const payload: UserLogin = await validateRequest(request, loginValidator)
    const ownerOnboardingService = new OwnerOnboardingService()

    const data = await ownerOnboardingService.loginWithPassword(payload)

    return response.status(HTTP_STATUS.OK).json({
      data,
      result: true,
      message: 'Logged in',
    })
  }

  async getCurrentUser({ auth, response }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const ownerOnboardingService = new OwnerOnboardingService(user.id)
      const userDetails = await ownerOnboardingService.getUserDetails().catch(() => {
        throw new UnAuthorizedException()
      })
      return response.status(HTTP_STATUS.OK).json({
        result: true,
        data: userDetails,
        message: 'User details',
        redirectTo: !userDetails.isOnboardingDone ? '/onboarding' : null,
      })
    } catch (error) {
      throw new UnAuthorizedException()
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const ownerOnboardingService = new OwnerOnboardingService(user.id)

    // veify user is valid
    await ownerOnboardingService.getUserDetails()
    await ownerOnboardingService.authService.deleteToken(
      user,
      user.currentAccessToken.identifier as string
    )
    return response.status(HTTP_STATUS.OK).json({
      result: true,
      data: null,
      message: 'Logged out',
    })
  }
}
