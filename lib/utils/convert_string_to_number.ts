import isStringNumber from './is_string_number.js'

/** Convert a string to a number
 * @param {string} value String to convert to number
 * @returns {number} Return the number value
 * @throws {Error} If the value is not a number
 */
export default function convertStringToNumber(value: string): number {
  if (!isStringNumber(value)) throw new Error('Invalid number')
  return Number(value)
}
