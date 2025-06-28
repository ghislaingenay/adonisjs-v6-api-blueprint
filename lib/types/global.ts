import { UPLOAD_BUCKET } from '#constants/config'

export enum Booleanish {
  TRUE = 'TRUE',
  FALSE = 'FALSE',
}

export type Prettify<T> = {
  [K in keyof T]: T[K]
}

export type Email = string
export type Mobile = string
export type Minutes = number | 1
export type UUID = string
export type Url = string

export type JSONStringified<T extends Array<any> | Record<string, unknown>> = T

export type FormatPageOptions = { defaultPage?: number; defaultResults?: number }
export type TinyInt = 0 | 1

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>
}[keyof T]

export type Nullable<T> = T | null

export type ColorValue = string

export type BucketName = { [K in keyof typeof UPLOAD_BUCKET]: K }[keyof typeof UPLOAD_BUCKET]
