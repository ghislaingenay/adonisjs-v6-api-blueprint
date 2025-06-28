import Country from '#models/country'
import { CountryElement, GetCountryParams, WithLucidMeta } from '#types'
import { returnWithMeta } from '#utils/database/meta_pagination'

export default class CountryRepository {
  async list(params: GetCountryParams) {
    const { page, limit, q } = params
    let builder = Country.query().select('iso3 as code', 'icon', 'name', 'iso')
    if (q) builder = builder.where('name', 'like', `%${q}%`)
    const response = await builder
      .orderBy('name', 'asc')
      .paginate(page, limit)
      .then((result) => result.toJSON() as WithLucidMeta<CountryElement[]>)
    return returnWithMeta(response, { page, limit })
  }

  static async exists(key: 'id' | 'iso3', value: string | number) {
    const country = await Country.query().where(key, value).first()
    return !!country
  }

  async iso(iso: string) {
    const country = await Country.query().where('iso', iso).first()
    if (!country) throw new Error('Country not found')
    return country
  }
}
