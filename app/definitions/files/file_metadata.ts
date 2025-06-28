import { FileFormat, FileType } from '#models/images/file_project_settings'
import { getReadableFileSize, SizeReadable } from '#utils/file'
import { MultipartFile } from '@adonisjs/core/bodyparser'

type NonSizeReadable = number
type FileSize<Readable> = Readable extends true ? SizeReadable : NonSizeReadable

export default class FileMetadata {
  file

  constructor(file: File | MultipartFile) {
    this.file = file
  }

  get name() {
    if (this.file instanceof MultipartFile) return this.file.clientName
    return this.file.name
  }

  get mime() {
    if (this.file instanceof MultipartFile) return `${this.file.type}/${this.file.extname}`
    return this.file.type
  }

  // Depends on mime
  get type() {
    const [type] = this.mime.split('/')
    return type as unknown as FileType
  }

  // Depends on mime
  get format() {
    const [, format] = this.mime.split('/')
    return format as unknown as FileFormat
  }

  private humanReadableSize(size: number) {
    return getReadableFileSize(size)
  }

  /** Give the side of the file */
  size<Readable extends boolean>({
    humanReadable = false as Readable,
  }: { humanReadable?: Readable } = {}): FileSize<Readable> {
    const size = this.file.size
    if (humanReadable) return this.humanReadableSize(size) as FileSize<Readable>
    return size as FileSize<Readable>
  }
}
