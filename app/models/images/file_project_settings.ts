/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from 'mongoose'

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
}

/** Image format
 * @description Does not contains "."
 */
export enum ImageFormat {
  JPEG = 'jpeg',
  JPG = 'jpg',
  PNG = 'png',
}

/** Video format
 * @description Does not contains "."
 */
export enum VideoFormat {
  MP4 = 'mp4',
}

export type FileFormat = (ImageFormat | VideoFormat)[]
const fileFormats: FileFormat = [
  ImageFormat.JPEG,
  ImageFormat.JPG,
  ImageFormat.PNG,
  VideoFormat.MP4,
]

// type FileAccessFormat = {
//   [FileType.IMAGE]: ImageFormat[]
//   [FileType.VIDEO]: VideoFormat[]
// }

export type FileProjectSettingsAttrs = {
  fileProjectId: string
  fileType: FileType
  format: FileFormat
  contentType: string
  createdAt: string
  maxSize: number
}

export interface FileProjectSettingsDoc extends mongoose.Document {
  [key: string]: any
  fileProjectId: string
  fileType: FileType
  contentType: string

  format: FileFormat
  createdAt: string
  maxSize: number
}

interface FileProjectSettingsModel extends mongoose.Model<FileProjectSettingsDoc> {
  build(attrs: FileProjectSettingsAttrs): FileProjectSettingsDoc
}
mongoose.set('strictQuery', false)

const fileProjectSettingsSchema = new mongoose.Schema<
  FileProjectSettingsDoc,
  FileProjectSettingsModel
>(
  {
    fileProjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'file_projects',
    },
    maxSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      enum: FileType,
    },
    contentType: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
      enum: fileFormats,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform(_, ret: any) {
        delete ret.__v
      },
    },
  }
)

fileProjectSettingsSchema.statics.build = (attrs: FileProjectSettingsAttrs) => {
  return new FileProjectSetting(attrs)
}

const FileProjectSetting = mongoose.model<FileProjectSettingsDoc, FileProjectSettingsModel>(
  'file_project_settings',
  fileProjectSettingsSchema
)

export { FileProjectSetting }
