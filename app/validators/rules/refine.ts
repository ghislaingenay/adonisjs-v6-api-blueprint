import vine from '@vinejs/vine'
import type { FieldContext } from '@vinejs/vine/types'

/**
 * A predicate that tests a value (and optionally the full data root).
 * Should return `true` if valid, `false` if invalid.
 */
export type RefinePredicate<T = unknown> = (value: T) => boolean | Promise<boolean>

/**
 * Options for our refine rule – you can extend this if you need additional flags.
 */
export interface RefineRuleOptions {
  message?: string
}
/**
 *


/**
 * A helper that mimics Zod’s `.refine()` by creating a custom VineJS rule.
 *
 * @param predicate   The function to test each value.
 * @param message     Error message; `'{{ field }}'` will be replaced by the field name.
 *
 * @returns A `Rule<RefineRuleOptions>` which you can call `.with({ message })` on.
 */
export function refineRule<T = unknown>(
  predicate: RefinePredicate<T>,
  message = 'The {{ field }} field did not pass refinement'
) {
  return vine.createRule<RefineRuleOptions>(
    async (value: unknown, options: RefineRuleOptions, field: FieldContext) => {
      const val = value as T // can be a base eelemnt or object

      const ok = await predicate(val)
      if (!ok) {
        field.report(
          // allow customizing via `options.message`
          options.message ?? message,
          'refine',
          field
        )
      }
    }
  )
}
