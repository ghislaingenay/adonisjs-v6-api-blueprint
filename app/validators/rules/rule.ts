import { FieldContext, Validation, ValidationRule, Validator } from '@vinejs/vine/types'

type ValidationOptions<Options> = {
  isAsync?: boolean
  implicit?: boolean
} & Options
export default function rule<Value = unknown, Options = Record<string, any>>(
  validate: Validator<Options>,
  opts?: ValidationOptions<Options>
) {
  const {
    isAsync = false,
    implicit = false,
    ...rest
  } = (opts || {}) as Options & {
    isAsync: boolean
    implicit: boolean
  }
  return {
    rule: {
      validator: (value: Value, options: Options, field: FieldContext) => {
        validate(value, options, field)
      },

      isAsync,
      implicit,
    } as ValidationRule<Options>,
    options: rest,
  } as Validation<Options>
}
