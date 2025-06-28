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
