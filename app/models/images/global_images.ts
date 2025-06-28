import mongoose from 'mongoose'

export type GlobalImagesAttrs = {
  hash: string
  /** Cloud bucket uploqd link */
  link: string
  size: number
  externalId?: string
  contentType: string
  createdAt: string
  // add metadata information
}

export interface GlobalImagesDoc extends mongoose.Document {
  [key: string]: any
  hash: string
  createdAt: string
  externalId: string
  size: number
  contentType: string
  /** Cloud bucket uploqd link */
  link: string
}

interface GlobalImagesModel extends mongoose.Model<GlobalImagesDoc> {
  build(attrs: GlobalImagesAttrs): GlobalImagesDoc
}
mongoose.set('strictQuery', false)

const globalImagesSchema = new mongoose.Schema<GlobalImagesDoc, GlobalImagesModel>(
  {
    hash: {
      type: String,
      fixed: 64,
      unique: true,
    },
    size: {
      type: Number,
      required: true,
    },
    link: {
      type: String,
      max: 255,
    },
    contentType: {
      type: String,
      required: true,
    },
    externalId: {
      type: String,
      max: 255,
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

globalImagesSchema.statics.build = (attrs: GlobalImagesAttrs) => {
  return new GlobalImage(attrs)
}

const GlobalImage = mongoose.model<GlobalImagesDoc, GlobalImagesModel>(
  'global_images',
  globalImagesSchema
)

export { GlobalImage }
