import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { MetaPage } from './http.js'

export type WithTransaction<T> = { data: T; trx: TransactionClientContract }
export type Trx<T> = { data: T; trx: TransactionClientContract }

export type WithMeta<T> = { data: T; meta: MetaPage }
export type WithLucidMeta<T> = { data: T; meta: LucidMetaPage }
//@ts-ignore
export type BuilderQuery<T> = ModelQueryBuilderContract<typeof T, T>

export type IdentifierKey = 'id' | 'slug' | string
export type Identifier = string | number

export type LucidMetaPage = {
  total: number
  /** Not defined if no results */
  perPage?: number
  lastPage: number
  /** Not defined if no results */
  currentPage: number
  firstPageUrl: string
  lastPageUrl: string
  nextPageUrl: string | null
  previousPageUrl: string | null
}

export type RepoOptions = {
  /** COmmit transaction when API call is finished
   * @description No need to call trx.commit() outside the repository class
   * @default false
   */
  autoCommit?: boolean
}
