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
    owner: 'auth/owner',
    user: 'auth/user',
  },
  owner: {
    branch: 'owner/branch',
    onboarding: 'owner/onboarding',
    dashboard: 'owner/dashboard',
    spaces: 'owner/space',
  },
  verify: {
    email: 'verify-email',
  },
}

const AuthController = () => import('#controllers/auth/auth_controller')
const AuthOwnerController = () => import('#controllers/auth/auth_owner_controller')
const UserEmailVerificationController = () =>
  import('#controllers/auth/email_verification_controller')
const OwnerOnboardingsController = () => import('#controllers/owner_onboardings_controller')
const CountryController = () => import('#controllers/countries_controller')
const OwnerCompanyBranchesController = () =>
  import('#controllers/owner/owner_company_branches_controller')
const OwnerDashboardController = () => import('#controllers/owner_dashboards_controller')
const OwnerSpacesController = () => import('#controllers/owner_spaces_controller')

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

router
  .group(() => {
    router.post('register', [AuthOwnerController, 'registerWithPassword']).use(middleware.guest())
    router.post('login', [AuthOwnerController, 'loginWithPassword']).use(middleware.guest())
    router.get('me', [AuthOwnerController, 'getCurrentUser']).use(middleware.auth())
    router.post('logout', [AuthOwnerController, 'logout']).use(middleware.auth())
  })
  .prefix(prefix.auth.owner)

router.get(prefix.country.options, [CountryController, 'list']).use(middleware.auth())

router
  .group(() => {
    router.post('/request', [UserEmailVerificationController, 'request'])
    router.get('/check', [UserEmailVerificationController, 'verify'])
  })
  .prefix(prefix.verify.email)
  .use(middleware.auth())

router
  .group(() => {
    router.post('company/:company', [OwnerOnboardingsController, 'createCompany'])
    router.post('complete/:company', [OwnerOnboardingsController, 'completeOnboarding'])
  })
  .prefix(prefix.owner.onboarding)
  .middleware(middleware.auth())

router
  .group(() => {
    router.get('/', [OwnerCompanyBranchesController, 'index'])
    router.get('/:branch', [OwnerCompanyBranchesController, 'one'])
    router.post('/', [OwnerCompanyBranchesController, 'create'])
    router.post('/:branch/:status', [OwnerCompanyBranchesController, 'status'])
    router.put('/:branch', [OwnerCompanyBranchesController, 'update'])
  })
  .prefix(prefix.owner.branch)
  .use(middleware.auth())

router
  .group(() => {
    router.get('/branch/:branch', [OwnerSpacesController, 'branch'])
    router.get('/:space', [OwnerSpacesController, 'one'])
    router.post('/:space/visibility', [OwnerSpacesController, 'visibility'])
    router.post('/branch/:branch/init', [OwnerSpacesController, 'create'])
    router.put('/:space', [OwnerSpacesController, 'update'])
    router.post('/:space/image', [OwnerSpacesController, 'uploadImage'])
    router.delete('/:space/image/:imageId', [OwnerSpacesController, 'removeImage'])
  })
  .prefix(prefix.owner.spaces)
  .middleware(middleware.auth())

router
  .get('/', [OwnerDashboardController, 'show'])
  .prefix(prefix.owner.dashboard)
  .use(middleware.auth())

router.get('*', async () => {
  throw new NotFoundException('Route not found')
})
