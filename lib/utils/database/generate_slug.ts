import { generateUUID } from '#utils/http/crypto'
import { LucidModel } from '@adonisjs/lucid/types/model'
import isSlugUnique from './is_slug_unique.js'

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
