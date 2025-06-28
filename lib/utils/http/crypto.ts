import crypto from 'node:crypto'

export const generateCode = (length = 6): string => {
  let integers = 10 ** length
  if (length > 10) throw new Error('Length of code must be less than 10')
  const code = crypto.randomInt(integers).toString().padStart(length, '0')
  return code
}

/** Can generate a token, id or secret
 * @description Generates a random 32 character hex string
 * @returns {string} A 32 character hex string
 */
export const generateToken = (): string => {
  const hex32 = crypto.randomBytes(16).toString('hex')
  return hex32
}

export const generateUUID = (): string => {
  const uuid = crypto.randomUUID()
  return uuid
}

export async function sha(message: string, digest: 'SHA-256' | 'SHA-1'): Promise<string> {
  const hash = crypto.createHash(digest)
  hash.update(message)
  return hash.digest('hex')
}
