### This document outlines the rules and best practices for building an AI agent in AdonisJS 6. These rules ensure maintainability, scalability, and adherence to AdonisJS conventions.

## General Principles

- Framework: AdonisJS 6+ with TypeScript.
- Language: TypeScript (strict mode enabled).
- Focus: Clean, modular, and idiomatic AdonisJS code.
- Style: Follow the project's coding standards (e.g., camelCase for variables, UPPER_SNAKE_CASE for constants).

## Project Structure

Follow the default AdonisJS structure with additional modularization for clarity:

## Coding Standards

- TypeScript Best Practices
- Enable strict mode in tsconfig.json.
- Use interfaces for type definitions where applicable.
- Avoid any and unknown types; rely on proper type inference.
- Use async/await for asynchronous operations.
- Document all functions and classes using TSdoc.

## Naming Conventions

- Files: Use lowercase with underscores (e.g., email_project_dto.ts).
- Variables: Use camelCase (e.g., emailProject).
- Constants: Use UPPER_SNAKE_CASE (e.g., MAX_RETRIES).
- Classes: Use PascalCase (e.g., EmailProjectDto).
- Functions: Use camelCase (e.g., serializeData).

## AdonisJS-Specific Guidelines

### Controllers

Location: `/app/controllers` => Use for export '#controllers/'

- Keep controllers lean; delegate business logic to services.
- Use dependency injection for services and repositories. Can also use on the function scope

Example: `/app/controllers/auth_controller.ts`

```ts
import ForbiddenException from '#exceptions/forbidden_exception'
import UnAuthorizedException from '#exceptions/un_authorized_exception'
import ValidationException from '#exceptions/unprocessable_entity_exception'
import { HTTP_STATUS, UserRegistration } from '#types'
import UserRepo from '#repo/user_repository'
import { AuthService } from '#services/auth_service'
import { loginValidator, registerValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

@inject()
export default class AuthController {
  constructor(protected authService: AuthService) {}

  async registerWithPassword({ request, response }: HttpContext) {
    const payload: UserRegistration = await request
      .validateUsing(registerValidator)
      .catch((error) => {
        throw new ValidationException(error)
      })
    const data = await this.authService.registerWithPassword(payload)
    return response.status(HTTP_STATUS.CREATED).json(data)
  }

  async loginWithPassword({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator).catch((error) => {
      throw new ValidationException(error)
    })
    const data = await this.authService.loginWithPassword(payload)
    return response.status(HTTP_STATUS.CREATED).json(data)
  }

  @inject()
  async getCurrentUser({ auth, response }: HttpContext, userRepo: UserRe) {
    try {
      const user = await userRepo.getUserOrFail()
      const isVerified = await userRepo.checkUser(user)
      if (!isVerified) throw new ForbiddenException('Forbidden')
      return response.status(HTTP_STATUS.OK).json(user.serialize())
    } catch (error) {
      throw new UnAuthorizedException()
    }
  }
}
```

### Services

Location: `/app/services` => Use for export '#services/'

Encapsulate business logic in services.
Place services in the app/services/directory.

Example: `/app/services/subscription_service.ts`

```ts
import InternalServerException from '#exceptions/internal_server_error_exception'
import NotFoundException from '#exceptions/not_found_exception'
import { GetSubscriptionAdminDto, HttpResponse, Serialized, SubscriptionStatus } from '#types'
import ProductPrice from '#models/product_price'
import Subscription from '#models/subscription'
import SubscriptionRepo from '#repo/subscription_repository'
import { generateRecursiveUUID } from '#utils/database'
import { getError } from '#utils/exceptions'
import { DateTime } from 'luxon'

export class SubscriptionService {
  subscriptionRepo
  constructor() {
    this.subscriptionRepo = new SubscriptionRepo()
  }
  async getSubscriptions(
    params: GetSubscriptionAdminDto
  ): Promise<HttpResponse<Serialized<Subscription>[]>> {
    try {
      const { data, meta } = await this.subscriptionRepo.getAll(params)
      const serializedSubscriptions = data.map((subscription) => subscription.serialize())
      return { result: true, message: 'Subscriptions fetched', data: serializedSubscriptions, meta }
    } catch (err) {
      throw getError(err)
    }
  }

  async createBasicSubscription(userId: number): Promise<HttpResponse<Serialized<Subscription>>> {
    const currentPrice = await ProductPrice.query()
      .preload('product')
      .where('product_type', '=', 'PRODUCT_SUB_BASIC')
      .first()
      .catch(() => {
        throw new InternalServerException('Failed to fetch product price')
      })
    if (!currentPrice) throw new NotFoundException('Product price not found')
    const basicSubscription = await Subscription.findBy('price_id', currentPrice.id).catch(() => {
      throw new InternalServerException('Failed to fetch subscription')
    })
    if (basicSubscription !== null) throw new NotFoundException('Subscription already exists')
    const { trx, data: subscription } = await this.subscriptionRepo.create({
      productId: currentPrice.product.id,
      priceId: currentPrice.id,
      slug: await generateRecursiveUUID(Subscription),
      startDate: DateTime.now(),
      status: SubscriptionStatus.APPROVED,
      userId,
    } as Subscription)
    await trx.commit()
    return { result: true, message: 'Subscription created', data: subscription.serialize() }
  }
}
```

### Repositories

Location: `/app/repositories` => Use for export '#repositories/'
Mostly includes non-static functions
Encapsulate database logic. Includes all api call to database.

Add transaction for updating, storing and deleting data.

Example: `/app/repositories/user_repository.ts`

```ts
import InternalServerException from '#exceptions/internal_server_error_exception'
import NotFoundException from '#exceptions/not_found_exception'
import { UserRole, WithTransaction } from '#types'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export default class UserRepository {
  async getUsers(params: GetUsers): Promise<User[]> {
    const whereConditions: string[] = []
    if (params.id) whereConditions.push(`"id" = :id`)
    if (params.role) whereConditions.push(`"role" = :role`)
    if (params.email) whereConditions.push(`"email" = :email`)
    if (params.mobile) whereConditions.push(`"mobile" = :mobile`)
    if (Number.isNaN(Number(params.isVerified)))
      params.isVerified
        ? whereConditions.push(`"verified_at" is not null`)
        : whereConditions.push(`"verified_at" is null`)
    const where = whereConditions.join(' AND ')
    try {
      const users = await User.query().whereRaw(where, params).exec()
      return users
    } catch (err) {
      throw new Error(err)
    }
  }

  /**
   * Fetch User by id
   * @param {number} id userId
   * @async  Await User db call
   * @returns {Promise<User>} User
   * @throws {NotFoundException} User not found
   * @throws {InternalServerException} Internal Server Error - Db issues
   */
  async getUserById(id: number): Promise<User> {
    try {
      const user = await User.findBy('id', id)
      if (!user) throw new NotFoundException('User not found')
      return user
    } catch (err) {
      if (err instanceof NotFoundException) throw err
      throw new InternalServerException()
    }
  }

  async getByExternalId(externalId: string): Promise<User> {
    try {
      const user = await User.findBy('external_customer_id', externalId)
      if (!user) throw new NotFoundException('User not found')
      return user
    } catch (err) {
      if (err instanceof NotFoundException) throw err
      throw new InternalServerException()
    }
  }

  static async getByEmail(email: string): Promise<User> {
    try {
      const user = await User.findBy('email', email)
      if (!user) throw new NotFoundException('User not found')
      return user
    } catch (err) {
      if (err instanceof NotFoundException) throw err
      throw new InternalServerException()
    }
  }
}
```

### Models

Location: `app/models/*` => use import for other files "#models/\*"
Use Lucid ORM for database interactions.
Define relationships and hooks in models.

Example: `app/models/invoice.ts`

```ts
import type { CollectionMethod, InvoiceStatus, JSONStringified, PriceType, UUID } from '#types'
import { generateUUID } from '#utils/crypto'
import { parseJSON } from '#utils/database'
import {
  BaseModel,
  beforeCreate,
  beforeSave,
  belongsTo,
  column,
  computed,
  hasMany,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import InvoiceBillingAddress from './invoice_billing_address.js'
import InvoiceItem from './invoice_item.js'
import User from './user.js'

export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare slug: UUID

  @column({ serializeAs: null })
  declare billingAddressId: number

  @belongsTo(() => InvoiceBillingAddress, {
    foreignKey: 'billingAddressId',
  })
  declare billingAddress: BelongsTo<typeof InvoiceBillingAddress>

  @column()
  declare customerId: number

  @belongsTo(() => User, { foreignKey: 'customerId' })
  declare customer: BelongsTo<typeof User>

  @column()
  declare status: InvoiceStatus | null

  @column()
  declare description: string | null

  @column()
  declare basePrice: number

  @column()
  declare totalPrice: number

  @column()
  declare type: PriceType

  @column()
  declare currency: string

  @column()
  // vatP won't be known in pending mode and only when the client will pay (card information with country)
  // need to be defined when invoice is paid
  declare vatP: number | null

  @column()
  declare amountPaid: number

  @column()
  declare amountDue: number

  @column()
  // need to refine this logic
  declare tax: number | null

  // link to payment Intent system
  @column()
  declare externalPaymentId: string | null

  @column()
  declare externalSubscriptionId: string | null

  @column()
  declare invoiceUrl: string | null

  @column()
  declare receiptUrl: string | null

  @column()
  declare subscription: UUID | null // slug

  @column()
  declare receiptNo: string // same as receipt_no

  @column({ consume: (value) => parseJSON(value), serialize: (value) => parseJSON(value) })
  declare metadata: JSONStringified<Record<string, string | number>> | null // json => array of string

  @column()
  /** For now, only percent, currently not used => no discount table for now */
  declare discount: number | null

  @column()
  declare paidAt: DateTime | null

  @column()
  declare collectionMethod: CollectionMethod | null // AUTO or MANUAL

  @column.date()
  declare dueDate: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  get isSubscription() {
    return this.subscription !== null
  }

  @beforeCreate()
  static assignUuid(invoice: Invoice) {
    if (!invoice.slug) invoice.slug = generateUUID()
    if (invoice.metadata) invoice.metadata = JSON.stringify(invoice.metadata) as any
  }

  @beforeSave()
  static async applyStringify(invoice: Invoice) {
    if (invoice.metadata) invoice.metadata = JSON.stringify(invoice.metadata) as any
  }

  @hasMany(() => InvoiceItem, {
    foreignKey: 'invoiceId',
  })
  declare items: HasMany<typeof InvoiceItem>
}
```

### Data Transfer Objects (DTOs)

Location: `app/dtos` => import to other files "#dtos/\*"
Use DTOs to serialize data before sending it to the client.
Can export others functions based on the
The name of the class will be the file + Client => amenity + client => AmenityClient

Example: `app/dtos/amenity.ts`

```ts
import Amenity from '#models/amenity'
import { AmenityCategory, Language, Locale } from '#types'

type AmenityOptionDto = { label: string; value: string }
export type AmenityDto = {
  name: string
  tagged: boolean
  category: AmenityCategory
  options: AmenityOptionDto[]
  key: string
  featured: boolean
  canHaveMultiple: boolean
}

/** User interface after serialization */
export default class AmenityClient {
  private amenity
  constructor(amenity: Amenity) {
    this.amenity = amenity
  }

  toJSON(lang: Locale): AmenityDto {
    return {
      name: this.amenity[`name_${lang as 'en' | 'th'}`],
      key: this.amenity.key,
      category: this.amenity.category,
      options:
        this.amenity.options && this.amenity.options.length
          ? this.amenity.options.map(
              (opt) =>
                ({
                  value: opt.value,
                  label: lang === Language.ENGLISH ? opt.labelEn : opt.labelTh,
                }) as AmenityOptionDto
            )
          : [],
      tagged: this.amenity.show_as_tag,
      canHaveMultiple: this.amenity.multiple,
      featured: this.amenity.is_feature,
    }
  }
}

const amenitiesToClient = (lang: Locale, amenities: Amenity[]) => {
  if (!amenities || !amenities.length) return [] as Amenity[]
  return amenities.map((am) => new AmenityClient(am).toJSON(lang))
}

export { amenitiesToClient }
```

### Validation

Location: `app/validators` => import to other files "#validators/\*"

Use validators for request validation.
Place validators in the app/validators/directory.
Example: `app/validators/auth.ts`

```ts
import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().maxLength(254),
    email: vine
      .string()
      .email()
      .unique(async (query, field) => {
        const user = await query.from('users').where('email', field).first()
        return !user
      }),
    password: vine.string().minLength(8).maxLength(32),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32),
  })
)
```

### Actions

Location: `app/actions` => used for '#actions/"
Function that intend to one thing
e.g. ending an email, convert html
function that can be used for cron

Example: `app/actions/search_places.ts`

```ts
import BadRequestException from '#exceptions/bad_request_exception'
import env from '#start/env'
import { PlaceDetailsApiResponse, SearchApiResponse } from '#types'
import axios, { AxiosError, AxiosResponse } from 'axios'

const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
const PLACE_API_URL = 'https://maps.googleapis.com/maps/api/place/details/json'
const API_KEY = env.get('GOOGLE_MAPS_API_KEY')

type SearchParams = {
  /** Geolocation of Bangkok */
  location?: '13.7563,100.5018' | string
  /** Radius for the search (in meters) */
  radius: 5000 | 10000 | 15000 | 20000 | number
  type?: string
  /** api key */
  key: string
  place_id?: string
  /** Search  */
  pagetoken?: string
  keyword?: 'coffee'
}

export default class SearchPlaces {
  static async list(params: Pick<SearchParams, 'pagetoken' | 'radius' | 'type' | 'location'>) {
    return await axios
      .get(PLACES_API_URL, {
        params: {
          location: params?.location ?? '13.7563,100.5018',
          radius: params.radius ?? 20000,
          keyword: 'coffee',
          key: API_KEY,
          pagetoken: params.pagetoken,
          type: params?.type ?? 'establishment|cafe', // i do not want to the small coffee shop stall
        } as SearchParams,
      })
      .then((response: AxiosResponse<SearchApiResponse>) => {
        const { data } = response
        if (data.status === 'ZERO_RESULTS' && !data.next_page_token)
          return {
            status: 'OK',
            results: [] as SearchApiResponse['results'],
            next_page_token: undefined,
          } as SearchApiResponse
        if (data.status !== 'OK' && data.next_page_token) throw new BadRequestException(data.status)
        else return data
      })
      .catch((err: AxiosError) => {
        const data = err.response?.statusText
        throw new BadRequestException(data)
      })
  }

  static async place(placeId: string) {
    return await axios
      .get(PLACE_API_URL, {
        params: {
          place_id: placeId,
          key: API_KEY,
        } as Pick<SearchParams, 'place_id' | 'key'>,
      })
      .then((response: AxiosResponse<PlaceDetailsApiResponse>) => {
        const { data } = response
        if (data.status !== 'OK') throw new BadRequestException(data.status)
        else return data
      })
      .catch((err: AxiosError) => {
        const data = err.response?.statusText
        throw new BadRequestException(data)
      })
  }
}
```

### Migrations files

Location: `database/migrations`
Migration file used to mograte up or down using AdonisJS system (node ace ...)

Example: `database/migrations/1738135095218_create_users_table.ts`

```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('mobile', 20).nullable().defaultTo('')
      table.string('password').notNullable()
      table.string('photo_url', 254).nullable().defaultTo('')
      table.json('metadata').nullable().defaultTo('{}')
      table.string('external_customer_id').nullable().defaultTo('')
      table.timestamp('verified_at').nullable()
      table.boolean('active').defaultTo(true)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

### Definitions

Location: `lib/definitions/` => Use file to export "#definitions/\*"
Utility classes that are not considered like services like to get error status, supabaase connector

Here are two examples

```ts
import BadRequestException from '#exceptions/bad_request_exception'
import ForbiddenException from '#exceptions/forbidden_exception'
import NotFoundException from '#exceptions/not_found_exception'
import UnAuthorizedException from '#exceptions/un_authorized_exception'
import { HTTP_STATUS, HttpStatus } from '#types'

class ErrorStatus {
  httpStatus: HTTP_STATUS
  constructor(err?: Error) {
    this.httpStatus = err ? this.getErrorStatus(err) : HTTP_STATUS.INTERNAL_SERVER_ERROR
  }

  private getErrorStatus(err: Error): HTTP_STATUS {
    if (err instanceof NotFoundException) return HTTP_STATUS.NOT_FOUND
    if (err instanceof BadRequestException) return HTTP_STATUS.BAD_REQUEST
    if (err instanceof TypeError) return HTTP_STATUS.BAD_REQUEST
    if (err instanceof SyntaxError) return HTTP_STATUS.BAD_REQUEST
    if (err instanceof ForbiddenException) return HTTP_STATUS.FORBIDDEN
    if (err instanceof UnAuthorizedException) return HTTP_STATUS.UNAUTHORIZED
    return HTTP_STATUS.INTERNAL_SERVER_ERROR
  }

  set(err: Error) {
    this.httpStatus = Number(this.getErrorStatus(err)) as HTTP_STATUS
    return this
  }

  get status() {
    return {
      get: () => {
        return this.httpStatus
      },
      stringify: () => {
        return this.httpStatus.toString() as HttpStatus
      },
    }
  }

  get isNotFound() {
    return this.status.get() === HTTP_STATUS.NOT_FOUND
  }

  get isBadRequest() {
    return this.status.get() === HTTP_STATUS.BAD_REQUEST
  }

  get isForbidden() {
    return this.status.get() === HTTP_STATUS.FORBIDDEN
  }

  get isUnAuthorized() {
    return this.status.get() === HTTP_STATUS.UNAUTHORIZED
  }

  get isServerError() {
    return this.status.get() === HTTP_STATUS.INTERNAL_SERVER_ERROR
  }
}

const errorStatus = new ErrorStatus()
export default errorStatus
export type { ErrorStatus }
```

```ts
import env from '#start/env'
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const connector = createClient(
  env.get('SUPABASE_PROJECT_URL'),
  env.get('SUPABASE_SERVICE_ROLE_KEY')
)

export default connector
```

### Types - Interfaces

Location: `lib/types` => "#types"
Types and interfaces used for the projects
When a new file is created, add it to index.ts (`lib/types/index.ts`)

Example: `lib/types/user.ts`

```ts
import { createRoleValidator, updateRoleValidator } from '#validators/role'
import { Infer } from '@vinejs/vine/types'
import { AuthProvider } from './auth.js'
import { Language } from './global.js'

export type CreateRoleDto = Infer<typeof createRoleValidator>
export type UpdateRoleDto = Infer<typeof updateRoleValidator>

export enum VerificationType {
  Password = 'password',
  Google = 'provider:google',
}

export type User = {
  id: number
  full_name?: string
  email: string
  profile_picture?: string
  username?: string
  preferred_language: Language
  provider: AuthProvider
  uid: string
  password: string
  verified_at?: string // ISO string
  verification_method?: VerificationType
  created_at: string
  updated_at?: string
  role_id: number
}

export type CoffeeShopOwner = {
  id: number
  user_id: number
  shop_id: number
  verification_status: string
  verification_proof: string
  approved_at?: string
  rejected_at?: string
  reject_reason?: string
}
```

In index.ts

```ts
export * from './user.js'
```

### Utils

Location: `lib/utils` => "#utils/\*"
Utils functions used in the server
Can be multiple functions in one file or separated
Use JSDOC for explaining the functions

Examples:

Example 1

`lib/utils/clone_object.ts`

```ts
export default function cloneObject<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}
```

Example 2

`lib/utils/database.ts`

```ts
// import BadRequestException from '#exceptions/bad_request_exception'
// import InternalServerException from '#exceptions/internal_server_error_exception'
// import ValidationException from '#exceptions/unprocessable_entity_exception'
import type {
  BuilderQuery,
  FormatPageOptions,
  Identifier,
  Limit,
  LucidMetaPage,
  MetaPage,
  Offset,
  WithLucidMeta,
  WithMeta,
} from '#types'
import db from '@adonisjs/lucid/services/db'
import { LucidModel } from '@adonisjs/lucid/types/model'
import { generateUUID } from './http/crypto.js'
import NotFoundException from '#exceptions/not_found_exception'
import InternalServerException from '#exceptions/internal_server_error_exception'
import isStringNumber from './is_string_number.js'
// import { getError } from './exceptions.js'

export const isSlugUnique = async (slug: string, schema: LucidModel): Promise<boolean> => {
  const sub = await schema.findBy('slug', slug)
  return !sub
}

const generateRandomNumberString = (length: number): string => {
  return String(Math.floor(Math.random() * 10 ** length))
}

type SlugOptions =
  | {
      uuid?: boolean
      suffix?: number
    }
  | {
      uuid: true
      suffix?: number
    }

const getBaseSlug = (name: string): string => {
  const trimValues = name
    .split(' ')
    .map((s) => s.trim())
    .join(' ')
  const baseSlug = trimValues.toLowerCase().replace(/ /g, '-').replace(/\//g, '')
  return baseSlug
}

export const generateSlugSuffix = (name: string, options: { suffix?: number }) => {
  const baseSlug = getBaseSlug(name)
  return `${baseSlug}-${generateRandomNumberString(options?.suffix || 0)}`
}

export const generateSlugUUID = (name: string) => {
  const baseSlug = getBaseSlug(name)
  return `${baseSlug}-${generateUUID()}`
}

export const generateSlug = (name: string, options?: SlugOptions) => {
  const trimValues = name
    .split(' ')
    .map((s) => s.trim())
    .join(' ')
  const baseSlug = trimValues.toLowerCase().replace(/ /g, '-').replace(/\//g, '')
  if (!options?.suffix || options.suffix === 0) return baseSlug
  const slugSuffix = options.uuid ? generateUUID() : generateRandomNumberString(options.suffix)
  return `${baseSlug}-${slugSuffix}`
}

type RecursiveSlugOptions =
  | {
      errorIfTaken?: undefined
    }
  | { errorIfTaken: true }

/** Use UUID generate slug */
export const generateRecursiveSlug = async (
  name: string,
  schema: LucidModel,
  options?: RecursiveSlugOptions
): Promise<string> => {
  const slug = generateSlugUUID(name)
  if (await isSlugUnique(slug, schema)) return slug
  if (options?.errorIfTaken) throw new Error(`"${name}" already exists`)
  // if (options?.errorIfTaken) throw new BadRequestException(`"${name}" already exists`)
  return await generateRecursiveSlug(name, schema)
}

/**
 * Generate a unique UUID
 * @param {LucidModel} schema Schema to check if the uuid is unique
 * @param {string} key primary key to check on the schema (default to "slug")
 * @returns {UUID} UUID
 */
export const generateRecursiveUUID = async (
  schema: LucidModel,
  key: string = 'slug'
): Promise<string> => {
  const uuid = generateUUID()
  const isUnique = async (el: string) =>
    await schema
      .findBy(key, el)
      .catch(() => false)
      .then((res) => {
        return !res
      })
  const isUniqueUUID = await isUnique(uuid)
  if (isUniqueUUID) return uuid
  return await generateRecursiveUUID(schema, key)
}

/**
 * Create meta object for pagination
 * @param param0 {page, limit, count}
 * @returns {MetaPage} MetaPage
 */
export const getMeta = ({
  page,
  limit,
  count,
}: Record<'page' | 'limit' | 'count', number>): MetaPage => {
  try {
    return {
      limit,
      page,
      total: count,
      pages: Math.ceil(count / limit),
    }
  } catch (err) {
    throw new TypeError('Error with getting meta')
  }
}
/**
 * Get limit and offset for pagination
 * @param page page number
 * @param limit results per page
 * @param options Set defaults or results per page
 * @returns  {[Limit, Offset]} [pageRows, startRow] as [Limit, Offset]
 */
export const getLimitOffset = (
  page?: number,
  limit?: number,
  options?: FormatPageOptions
): [Limit, Offset] => {
  const { defaultPage = 1, defaultResults = 20 } = options || {}
  page = Number(page) || defaultPage
  limit = Number(limit) || defaultResults
  const pageRows = limit
  const startRow = pageRows * (page - 1)
  return [pageRows, startRow] as [Limit, Offset]
}

export const getMetaORM = async (params: {
  page: number
  limit: number
  schema: LucidModel
  sql: string
}): Promise<MetaPage> => {
  const [{ count }] = (await params.schema
    .query()
    .from(params.sql)
    .count('*', 'count')) as unknown as { count: number }[]
  return getMeta({ page: params.page, limit: params.limit, count })
}

export const parseJSON = <T>(value: string): T | null => {
  try {
    if (typeof value !== 'string' && value) return value as T
    return JSON.parse(value)
  } catch (err) {
    return null
  }
}

/**
 * Get count from the db from an sql query
 * @param primaryKey Primary key from teh db with the specific table
 * @param sql sql query to get the count
 * @returns {number} count
 * @throws {InternalServerException} Error with getting count
 * @throws {TypeError} Primary key must be a string
 */
export const getCount = async (primaryKey: string, sql: string): Promise<number> => {
  if (typeof primaryKey !== 'string') throw new TypeError('Primary key must be a string')
  try {
    const data = await db
      .rawQuery(`SELECT COUNT("q"."${primaryKey}") as "count" FROM (${sql}) as "q"`)
      .exec()
      .catch((err) => {
        console.error(err)
        throw new Error('Error with getting count')
        // throw new InternalServerException('Error with getting count')
      })

    const rows = data.rows as { count: number }[]
    return Number(rows[0].count ?? 0)
  } catch (err) {
    throw new Error('Error with getting count')
    // if (!(err instanceof InternalServerException))
    //   throw getError(err, { default_message: 'Error with getting count' })
    // throw err
  }
}

export const convertSqlBuilderToRaw = (buildQuery: BuilderQuery<unknown>): string => {
  return buildQuery.toSQL().sql
}

export const checkValidSlug = (slug: string): string => {
  if (!slug) throw new Error('Invalid slug')
  const isValidSlug = !isStringNumber(slug)
  if (!isValidSlug) throw new Error('Invalid slug')
  // if (!slug) throw new BadRequestException('Invalid slug')
  // const isValidSlug = !isStringNumber(slug)
  // if (!isValidSlug) throw new ValidationException('Invalid slug')
  return slug
}

export const snakeToCamelCase = (val: string): string => {
  return val.replace(/(_\w)/g, (m) => m[1].toUpperCase())
}

export const camelToSnakeCase = (val: string): string => {
  return val.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)
}

export const replaceAllSnakeToCamelCase = <T>(obj: Record<string, unknown>): T => {
  const newObj: Record<string, unknown> = {}
  for (const key in obj) {
    newObj[snakeToCamelCase(key)] = obj[key]
  }
  return newObj as T
}

export const replaceAllCamelToSnakeCase = <T>(obj: Record<string, unknown>): T => {
  const newObj: Record<string, unknown> = {}
  for (const key in obj) {
    newObj[camelToSnakeCase(key)] = obj[key]
  }
  return newObj as T
}

export const replaceArraySnakeToCamelCase = <T>(arr: Record<string, unknown>[]): T[] => {
  return arr.map((obj) => replaceAllSnakeToCamelCase(obj))
}

export const fillValueWithZeros = (value: number, length: number) => {
  const str = String(value)
  const array = Array(length).fill(0)
  for (let i = array.length - 1; i >= 0; i--) {
    if (str[i] === undefined) break
    if (str[i] !== undefined) array[i] = str[i]
  }
  return array.join('')
}

/** Doesn't includes where in the statement */
export const getWhereSql = (where: string[]): string => {
  return where.length ? `${where.join(' AND ')}` : ''
}

export const getMetaPagination = (
  { total, perPage }: LucidMetaPage,
  { page, limit }: Record<'page' | 'limit', number>
): MetaPage => {
  const resultsPerPage = perPage ?? limit
  return {
    limit: resultsPerPage,
    page,
    total: total,
    pages: !total ? 0 : Math.ceil(total / resultsPerPage),
  }
}

export const returnWithMeta = <T>(
  data: WithLucidMeta<T>,
  pagination: Record<'page' | 'limit', number>
): WithMeta<T> => {
  return { data: data.data, meta: getMetaPagination(data.meta, pagination) }
}

type WhereIn =
  | {
      data: string[]
      type: 'string'
    }
  | {
      data: null
      type: null
    }
  | {
      type: 'number'
      data: number[]
    }

export const formatWhereIn = (value: string): WhereIn => {
  const nullResponse = { data: null, type: null }
  if (!value) return nullResponse
  if (!value.trim()) return nullResponse
  const splitted = value.split(',')
  if (splitted.length === 1) {
    if (isStringNumber(splitted[0]))
      return { data: splitted.map((val) => Number(val)), type: 'number' }
    return { data: splitted, type: 'string' }
  }
  const areOnlyNumbers = splitted.every(isStringNumber)
  if (areOnlyNumbers) return { data: splitted.map(Number), type: 'number' }
  return { data: splitted, type: 'string' }
}

export async function findByIdentifier<T>(
  model: LucidModel,
  identifier: Identifier,
  messages?: {
    notFound?: string
    internalError?: string
  }
): Promise<T> {
  try {
    const response =
      typeof identifier === 'number'
        ? await model.find(identifier)
        : await model.findBy('slug', identifier)
    if (!response) throw new NotFoundException(messages?.notFound ?? 'Item not found')
    return response as T
  } catch (err) {
    throw new InternalServerException(messages?.internalError ?? 'Server Error')
  }
}
```

Example 3

`lib/match_text.ts`

```ts
/* eslint-disable @unicorn/no-for-loop */
/** Match text between two strings
 * @param {string} text - The text to match
 * @param {string} q - The query to match
 * @description Case sensitive
 * @returns {boolean} - True if the text match the query
 * */
const matchText = (text: string, q: string) => {
  if (!text) return false
  if (q.length === 0) return true // no text so could be valid
  if (q.length > text.length) return false // query should be less than text or same
  for (let i = 0; i < q.length; i++) {
    const char = q[i]
    if (char !== text[i]) return false
  }
  return true
}

export default matchText
```

### Environment Configuration

Use .env files for environment-specific configuration.
Define environment variables in start/env.ts for type safety.

### Testing

Use Japa for unit and functional tests.
Organize tests in the tests/ directory.
Example:

```ts
import { test } from '@japa/runner'

test.group('Email Project', () => {
  test('ensure email project can be created', async ({ client }) => {
    const response = await client.post('/email-projects').json({
      name: 'New Project',
      description: 'A test project',
    })

    response.assertStatus(201)
    response.assertBodyContains({ name: 'New Project' })
  })
})
```

## Styling & Documentation

- Use ESLint and Prettier for linting and formatting.
- Document all non-trivial logic with inline comments.
- Use TSdoc for functions, classes, and modules.

## Performance & Security

- Use caching for frequently accessed data.
- Sanitize all user inputs to prevent SQL injection and XSS.
- Use HTTPS and secure cookies in production.

### CLI

AdonisJS have a CLI that can be used to speed up the workflow

For example, for adding a new feature about customer

- `node ace make:model -mc customer` => Add model, migration and controller in their separated folders
- `node ace make:service customer` => Add service with the given name in `app/services/*`
- `node ace make:validator customer` => Add validator with the given name in `app/validtors/*`

For repositories or dtos, it needs to be created manually, or a custom node ace function can be created
