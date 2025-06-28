import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name', 254).nullable()
      table.string('email', 254).notNullable().unique()
      table.string('profile_picture').nullable().defaultTo('')
      table.string('uid').nullable().defaultTo('')
      table.enum('provider', ['password', 'google']).nullable().defaultTo('')
      table.string('mobile', 20).nullable().defaultTo('')
      table.string('password').notNullable()
      table.string('photo_url', 254).nullable().defaultTo('')
      table.json('metadata').nullable().defaultTo('{}')
      table.string('slug', 10).unique()
      table.string('external_customer_id').nullable().defaultTo('')
      table
        .integer('country_id')
        .unsigned()
        .references('id')
        .inTable('countries')
        .nullable()
        .onDelete('RESTRICT')
      table.timestamp('verified_at').nullable()
      table.boolean('active').defaultTo(true)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.index('email')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
