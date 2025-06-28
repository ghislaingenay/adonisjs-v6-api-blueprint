import { getCountryValidator } from '#validators/country'
import { Infer } from '@vinejs/vine/types'

export type GetCountryParams = Infer<typeof getCountryValidator>

export type CountryElement = {
  code: string
  icon: string
  name: string
  iso: string
}
