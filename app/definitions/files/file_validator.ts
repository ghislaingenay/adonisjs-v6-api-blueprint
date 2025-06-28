import BadRequestException from '#exceptions/bad_request_exception'
import InternalServerException from '#exceptions/internal_server_error_exception'
import NotFoundException from '#exceptions/not_found_exception'
import { FileProject, FileProjectDoc } from '#models/images/file_project'
import { FileProjectSetting, FileProjectSettingsDoc } from '#models/images/file_project_settings'
import { BucketName } from '#types'
import cloneObject from '#utils/clone_object'
import { getReadableFileSize } from '#utils/file'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import FileMetadata from './file_metadata.js'

export default class FileValidator extends FileMetadata {
  private code
  constructor(code: BucketName, file: File | MultipartFile) {
    super(file)
    this.code = code
  }

  private haveSameExtensionAndFormat() {
    return this.name.split('.').pop() === (this.format as unknown as string)
  }

  private haveMatchSettings(settings: FileProjectSettingsDoc[]): FileProjectSettingsDoc | null {
    if (!settings || settings.length === 0)
      throw new BadRequestException('This file cannot be processed')
    const haveSameExtension = this.haveSameExtensionAndFormat()
    if (!haveSameExtension)
      throw new BadRequestException('File extension and format must be the same')
    return (
      settings.find((fileSetting) => {
        return fileSetting.contentType === this.mime
      }) ?? null
    )
  }

  private async getFileProject(): Promise<FileProjectDoc & { settings: FileProjectSettingsDoc[] }> {
    const fileProject = await FileProject.findOne({ code: this.code }).catch(() => {
      throw new InternalServerException('Cannot retrieve file project')
    })
    if (fileProject === null) throw new NotFoundException('Code might be missing or invalid')
    const settings = await FileProjectSetting.find({ fileProjectId: fileProject._id })
    return {
      ...cloneObject<FileProjectDoc>(fileProject),
      settings: cloneObject<FileProjectSettingsDoc[]>(settings),
    } as FileProjectDoc & { settings: FileProjectSettingsDoc[] }
  }

  /** Check the size of the file based on the seetings linked to the project */
  checkSize(settingSize: number): boolean {
    const fileSize = this.size({ humanReadable: false })
    if (settingSize < fileSize)
      throw new BadRequestException(
        'File size is too large - Max size is ' + getReadableFileSize(settingSize)
      )
    return true
  }

  async handle(): Promise<FileProjectDoc & { setting: FileProjectSettingsDoc }> {
    const fileProject = await this.getFileProject()
    const setting = this.haveMatchSettings(fileProject.settings)
    if (!setting) throw new BadRequestException('This file cannot be processed')
    this.checkSize(setting.maxSize)
    return { ...fileProject, setting } as unknown as FileProjectDoc & {
      setting: FileProjectSettingsDoc
    }
  }
}
