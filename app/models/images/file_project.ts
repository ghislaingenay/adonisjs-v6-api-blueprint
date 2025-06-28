/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from 'mongoose'

export type FileProjectAttrs = {
  name: string
  createdAt: string
  code: string
  description?: string
}

export interface FileProjectDoc extends mongoose.Document {
  [key: string]: any
  name: string
  createdAt: string
  description?: string
  code: string
}

interface FileProjectModel extends mongoose.Model<FileProjectDoc> {
  build(attrs: FileProjectAttrs): FileProjectDoc
}
mongoose.set('strictQuery', false)

const fileProjectSchema = new mongoose.Schema<FileProjectDoc, FileProjectModel>(
  {
    name: {
      type: String,
      max: 100,
      required: [true, 'Name is required'],
    },
    code: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: '',
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

fileProjectSchema.statics.build = (attrs: FileProjectAttrs) => {
  return new FileProject(attrs)
}

const FileProject = mongoose.model<FileProjectDoc, FileProjectModel>(
  'file_projects',
  fileProjectSchema
)

export { FileProject }
