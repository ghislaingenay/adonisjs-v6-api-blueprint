import CountryRepository from '#repo/country'
import { GetCountryParams } from '#types'

export class CountryService {
  countryRepository
  constructor() {
    this.countryRepository = new CountryRepository()
  }
  async list(params: GetCountryParams) {
    return await this.countryRepository.list(params)
  }
}
