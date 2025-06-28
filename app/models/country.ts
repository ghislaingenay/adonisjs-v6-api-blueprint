import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Country extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare name: NonNullable<string>

  @column()
  declare iso: NonNullable<string>

  @column({
    columnName: 'iso3',
  })
  declare iso3: NonNullable<string>

  @column()
  declare icon: string | null

  @column()
  declare numcode: NonNullable<number>

  @column()
  declare phoneCode: NonNullable<number>
}
