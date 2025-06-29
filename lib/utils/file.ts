import { SizeReadable } from '#types'
import { readFile } from 'node:fs/promises'

export const toBase64 = async (filePath: string): Promise<string> => {
  const buffer = await readFile(filePath)
  return buffer.toString('base64')
}
export const toBatchBase64 = (files: string[]) => {
  return Promise.all(files.map(toBase64))
}

export const getReadableFileSize = (size: number): SizeReadable => {
  if (size < 1024) return `${size}B`
  if (size < 1024 ** 2) return `${(size / 1024).toFixed(2)}KB`
  if (size < 1024 ** 3) return `${(size / 1024 ** 2).toFixed(2)}MB`
  return `${(size / 1024 ** 3).toFixed(2)}GB`
}
