/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const prefix = {
  country: {
    options: 'country/options',
  },
  auth: {
    user: 'auth/user',
  },

  verify: {
    email: 'verify-email',
  },
}

const AuthController = () => import('#controllers/auth/auth_controller')
const UserEmailVerificationController = () =>
  import('#controllers/auth/email_verification_controller')
const CountryController = () => import('#controllers/countries_controller')

import NotFoundException from '#exceptions/not_found_exception'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
router
  .group(() => {
    router.post('register', [AuthController, 'registerWithPassword']).use(middleware.guest())
    router.post('login', [AuthController, 'loginWithPassword']).use(middleware.guest())
    router.get('me', [AuthController, 'getCurrentUser']).use(middleware.auth())
    router.post('logout', [AuthController, 'logout']).use(middleware.auth())
  })
  .prefix(prefix.auth.user)

router.get(prefix.country.options, [CountryController, 'list']).use(middleware.auth())

router
  .group(() => {
    router.post('/request', [UserEmailVerificationController, 'request'])
    router.get('/check', [UserEmailVerificationController, 'verify'])
  })
  .prefix(prefix.verify.email)
  .use(middleware.auth())

router.get('*', async () => {
  throw new NotFoundException('Route not found')
})
