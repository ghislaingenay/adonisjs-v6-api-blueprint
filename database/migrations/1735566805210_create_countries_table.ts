import { BaseSchema } from '@adonisjs/lucid/schema'
import { DateTime } from 'luxon'

export default class extends BaseSchema {
  protected tableName = 'countries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('created_at').defaultTo(DateTime.now())
      table.timestamp('updated_at')
      table.string('name', 200).notNullable()
      table.string('iso', 2).notNullable()
      table.string('iso3', 3).notNullable()
      table.string('icon', 200).nullable()
      table.integer('numcode', 6).notNullable()
      table.integer('phone_code', 5).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
