import { JSONStringified } from '#types'
import parseJSON from '#utils/parse_json'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { slugify } from '@adonisjs/lucid-slugify'
import { BaseModel, column, computed, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Country from './country.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare profilePicture: string | null

  @column()
  declare uid: string | null

  @column()
  declare provider: 'password' | 'google' | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column({ serializeAs: null })
  declare externalCustomerId: string | null

  @column()
  declare photoUrl: string | null

  @column({ serializeAs: null })
  declare mobile: string | null

  @column()
  declare countryId: number | null

  @hasOne(() => Country, {
    foreignKey: 'countryId',
  })
  declare country: HasOne<typeof Country>

  @column({
    serializeAs: null,
    consume: (value) => parseJSON(value),
    prepare: (value) => JSON.stringify(value),
  })
  declare metadata: JSONStringified<{}> | null

  @column.dateTime({ serializeAs: null })
  declare verifiedAt: DateTime | null

  @column({ serializeAs: null })
  declare active: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @computed()
  get isVerified() {
    return this.verifiedAt !== null
  }

  @column()
  @slugify({
    strategy: 'shortId',
    fields: ['id'],
    maxLength: 10,
  })
  declare slug: string
}
