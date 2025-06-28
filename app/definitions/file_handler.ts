import InternalServerException from '#exceptions/internal_server_error_exception'
import NotFoundException from '#exceptions/not_found_exception'
import { GlobalImage, GlobalImagesDoc } from '#models/images/global_images'
import { BucketName } from '#types'
import { getError } from '#utils/http/exceptions'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import FileChecker from './files/file_checker.js'
import { UploadProvider } from './upload_provider.js'

/** Connect only to global image and check files */
export class FileHandler {
  uploadProvider
  bucketName: string
  constructor(bucketName: BucketName) {
    this.bucketName = bucketName
    this.uploadProvider = new UploadProvider(bucketName)
  }

  private async saveImageLink(imageId: string, externalId: string, link: string) {
    return await GlobalImage.findByIdAndUpdate(
      { _id: imageId },
      { link, externalId },
      { new: true }
    )
      .catch(() => {
        throw new InternalServerException('Error updating image')
      })
      .then((res) => res as GlobalImagesDoc)
  }

  async upload(file: MultipartFile, fileName: string) {
    const checker = new FileChecker(file)

    let { img, isNew } = await checker.handle()

    if (isNew) {
      // API call to upload the image
      let uploadResponse = await this.uploadProvider.upload(file, fileName)

      img = await this.saveImageLink(img._id as string, uploadResponse.publicId, uploadResponse.url)
    }

    return img
  }

  // extenalId smae as  globalImg._id
  async remove(externalId: string) {
    // remove the image from the third-party API
    const globalImg = await GlobalImage.findById(externalId)
    if (!globalImg) throw new NotFoundException('Image not found')
    try {
      await this.uploadProvider.destroy(globalImg.externalId)
      await GlobalImage.findByIdAndDelete({ _id: globalImg._id })
    } catch (err) {
      // resave the image => like roolback effect
      throw getError(err, {
        default_message: 'Error removing image',
      })
    }
    return true
  }
}
