import BadRequestException from '#exceptions/bad_request_exception'
import phash from '#utils/perceptual_hash'
import binaryToHex16 from '#utils/string/binary_to_hex_16'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import fs from 'node:fs'

export default class FileHasher {
  file
  constructor(file: File | MultipartFile) {
    this.file = file
  }

  async hash(): Promise<string> {
    let file = this.file
    let filePathName = ''
    try {
      // convert multipartfile to file
      if (this.file instanceof MultipartFile) {
        await this.file.move('tmp', {
          name: this.file.clientName,
          overwrite: true,
        })
        filePathName = this.file.filePath as string
      } else {
        const arrayBuffer = await (file as File).arrayBuffer()
        const bufferObject = Buffer.from(arrayBuffer)
        filePathName = 'tmp/' + this.file.name
        fs.writeFileSync(filePathName, bufferObject)
      }
    } catch (err) {
      console.error(err)
      throw new BadRequestException('Invalid buffer')
    }

    return new Promise(async (resolve, reject) => {
      // imageHash(bufferObject.toString(), 16, true, (err: Error, hash: string) => {
      try {
        const hash = await phash(filePathName)
        return resolve(binaryToHex16(hash))
      } catch (err) {
        console.error(err)
        reject(new BadRequestException('Error hashing file'))
      }
    })
  }

  hammingDistance(hash1: string, hash2: string): number {
    let count = 0
    // eslint-disable-next-line @unicorn/no-for-loop
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] !== hash2[i]) count++
    }
    return count
  }

  findHash(newHash: string, storedHash: string[]): string | null {
    for (const currHash of storedHash) {
      // const dist = require("sharp-phash/distance");
      const distance = this.hammingDistance(newHash, currHash)
      if (distance <= 5) {
        // Allow small differences
        return currHash // Duplicate found
      }
    }
    return null
  }
}
