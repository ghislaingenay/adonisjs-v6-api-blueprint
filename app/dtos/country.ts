import Country from '#models/country'
import invariant from 'tiny-invariant'

export type CountryDto = {
  name: string
  icon: string
  iso: string
}

export default class CountryClient<T extends Country> {
  private ressource
  constructor(ressource: T) {
    this.ressource = ressource
  }

  toJSON(): CountryDto {
    invariant(this.ressource, 'Country is not defined')
    return {
      name: this.ressource.name,
      icon: this.ressource.icon ?? '',
      iso: this.ressource.iso,
    }
  }
}
