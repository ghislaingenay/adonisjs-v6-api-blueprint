import { COUNTRIES } from '#constants/country'
import Country from '#models/country'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Country.createMany(COUNTRIES as any)
  }
}
