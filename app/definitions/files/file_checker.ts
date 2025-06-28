import { GlobalImage, GlobalImagesDoc } from '#models/images/global_images'
import cloneObject from '#utils/clone_object'
import { DateTime } from 'luxon'
import FileHasher from './file_hasher.js'
import InternalServerException from '#exceptions/internal_server_error_exception'
import NotFoundException from '#exceptions/not_found_exception'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import FileMetadata from './file_metadata.js'

/** FileChecker
 *  Handles the creation of imge in GlobalImage and returns a new image or image of already exists
 *  */
export default class FileChecker extends FileHasher {
  metadata
  constructor(file: File | MultipartFile) {
    super(file as File)
    this.metadata = new FileMetadata(file)
  }

  private async images() {
    const response = (await GlobalImage.find({}, ['_id', 'hash'])) as unknown as {
      hash: string
      _id: string
    }[]
    return cloneObject(response)
  }

  /** Just creqte the image, doesn't includes the link yet */
  private async createImage(hash: string) {
    try {
      const response = await GlobalImage.create({
        hash,
        link: '',
        size: this.metadata.size({ humanReadable: false }),
        contentType: this.metadata.mime,
        createdAt: DateTime.now().toISO(),
      })
      return cloneObject(response)
    } catch (err) {
      throw new InternalServerException('Error creating image')
    }
  }

  private async getImage(hash: string) {
    try {
      const response = await GlobalImage.findOne({ hash })
      if (!response) throw new NotFoundException('Image not found')
      return cloneObject(response)
    } catch (err) {
      if (err instanceof NotFoundException) throw err
      throw new InternalServerException('Error retrieving image')
    }
  }

  async handle(): Promise<{ isNew: boolean; img: GlobalImagesDoc }> {
    const hash = await this.hash()
    const imgHashing = await this.images()
    const hashes = imgHashing.map(({ hash: hs }) => hs)
    const foundHash = this.findHash(hash, hashes)
    // eslint-disable-next-line no-constant-condition
    if (foundHash) return { img: await this.getImage(foundHash), isNew: false }
    return { isNew: true, img: await this.createImage(hash) }
  }
}
