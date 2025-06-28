import { Exception } from '@adonisjs/core/exceptions'
import { CherryPick, ModelObject } from '@adonisjs/lucid/types/model'

export type MetaPage = {
  page: number
  /** Results per page */
  limit: number
  total: number
  pages: number
}
export type Limit = number
export type Offset = number

export type HttpResponse<T> = {
  [key: string]: any
  result: boolean
  data: T
  message?: string
  meta?: MetaPage
}

type ModelSerial = { serialize(cherryPick?: CherryPick): ModelObject }
export type Serialized<T extends ModelSerial> = ReturnType<T['serialize']>

/** Try Response | [null, Error] | [T, null] */
export type TryResponse<T> = [null, Error] | [T, null]
export type Try<T> = [null, Error] | [T, null]

export type TryObject<T> =
  | { data: T; error?: undefined }
  | { data?: undefined; error: Error | Exception }
