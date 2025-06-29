import { REGEX_DIGIT, STRING_PAGE_RESULTS } from '#constants/database'
import vine from '@vinejs/vine'

export const getCountryObject = vine.object({
  page: vine
    .string()
    .regex(REGEX_DIGIT)
    .transform((val) => Number.parseInt(val, 10)),
  limit: vine.enum([...STRING_PAGE_RESULTS, '300']).transform((val) => Number.parseInt(val, 10)),
  q: vine.string().maxLength(100).optional(),
})

export const getCountryValidator = vine.compile(getCountryObject)
