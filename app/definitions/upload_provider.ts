import BadRequestException from '#exceptions/bad_request_exception'
import InternalServerException from '#exceptions/internal_server_error_exception'
import UnAuthorizedException from '#exceptions/un_authorized_exception'
import { BucketName } from '#types'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { promises as fs } from 'node:fs'
import { connector } from './supabase.js'

type UploadResponse = {
  publicId: string
  url: string
}

// type RenameResponse = {
//   publicId?: string
//   url?: string
// }

type GetResponse = {
  publicId: string
  url: string
  bytes: number
  format: string
}

type DestroyResponse = {
  result: string
}

export class UploadProvider {
  bucketName
  constructor(bucketName: BucketName) {
    this.bucketName = bucketName
  }

  private handleError(err: any) {
    if (err.status === 401) {
      return new UnAuthorizedException(
        'Your request was not authorized, either due to missing or invalid API key provided.'
      )
    }
    if (err.status === 400)
      return new BadRequestException(
        'Your request input was invalid. Please check your request and try again.'
      )
    return new InternalServerException('An unexpected error occurred. Please try again later.')
  }

  /** Upload a file to Supabase Storage */
  async upload(file: MultipartFile, fileName: string) {
    try {
      console.log('Uploading file:', file)
      const filePath = file.state === 'moved' ? (file.filePath as string) : (file.tmpPath as string)
      const loadedFile = await fs.readFile(filePath as string)
      const { data, error } = await connector.storage
        .from(this.bucketName)
        .upload(fileName, loadedFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'application/octet-stream',
        })
        .then(async (res) => {
          await fs.unlink(filePath as string) // Clean up temp file
          return res
        })
      if (error) throw error
      const getPublicUrl = connector.storage.from(this.bucketName).getPublicUrl(fileName)

      console.log('File uploaded:', data, getPublicUrl)
      return {
        publicId: data.id,
        url: getPublicUrl.data.publicUrl,
      } as UploadResponse
    } catch (err: any) {
      console.error('Upload error:', err)
      throw this.handleError(err)
    }
  }

  /** Rename a file (Supabase does not support direct rename, so copy and delete) */
  // async rename(publicId: string, newName: string): Promise<RenameResponse> {
  //   try {
  //     const { error } = await connector.storage.from(this.bucketName).copy(publicId, newName)
  //     if (error) throw error
  //     await connector.storage.from(this.bucketName).remove([publicId])
  //     const info = await connector.storage.from(this.bucketName).info(newName)
  //     if (info.error) throw info.error
  //     const urlResponse = await connector.storage.from(this.bucketName).getPublicUrl(newName)
  //     return { publicId: info.data.id, url: urlResponse.data.publicUrl }
  //   } catch (err: any) {
  //     throw this.handleError(err)
  //   }
  // }

  /** Get file metadata and public URL */
  async get(publicId: string): Promise<GetResponse> {
    try {
      const { data, error } = await connector.storage.from(this.bucketName).download(publicId)
      if (error) throw error
      const { data: publicUrl } = connector.storage.from(this.bucketName).getPublicUrl(publicId)
      const info = await connector.storage.from(this.bucketName).info(publicId)
      if (info.error) throw info.error
      return {
        publicId: info.data.id,
        url: publicUrl.publicUrl,
        bytes: data.size,
        format: data.type,
      }
    } catch (err: any) {
      throw this.handleError(err)
    }
  }

  /** Delete a file from Supabase Storage */
  async destroy(publicId: string): Promise<DestroyResponse> {
    try {
      const { error } = await connector.storage.from(this.bucketName).remove([publicId])
      if (error) throw error
      return { result: 'ok' }
    } catch (err: any) {
      throw this.handleError(err)
    }
  }
}
