/** Parse the value
 * @param value - The value to parse
 * @returns The parsed value or null if it fails
 */
function parseJSON<T>(value: string): T | null {
  if (Array.isArray(value)) return value as unknown as T
  if (typeof value === 'object') return value as unknown as T
  try {
    return JSON.parse(value)
  } catch (err) {
    return null
  }
}

function parseJSONRecursively<T>(value: string | null): T | null {
  if (value === null) return null
  if (Array.isArray(value)) return value as unknown as T
  if (typeof value === 'object') return value as unknown as T
  return parseJSONRecursively(parseJSON(value))
}

export default parseJSON
export { parseJSONRecursively }
