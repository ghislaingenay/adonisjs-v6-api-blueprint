import type { HttpContext } from '@adonisjs/core/http'

import { CountryService } from '#services/country_service'
import validateRequest from '#utils/database/validate_request'
import { getCountryValidator } from '#validators/country'
import { inject } from '@adonisjs/core'

@inject()
export default class CountriesController {
  constructor(protected countryService: CountryService) {}
  async list({ request, response, auth }: HttpContext) {
    await auth.authenticate()
    const params = await validateRequest(request, getCountryValidator)
    const countryMeta = await this.countryService.list(params)

    return response.status(200).json({
      result: true,
      meta: countryMeta.meta,
      data: countryMeta.data,
      message: 'Countries',
    })
  }
}
