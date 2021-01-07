import * as mongoose from 'mongoose'
import { SearchDetailType } from '../../types/global'

const { Schema } = mongoose

const SneakerSchema = new Schema<SearchDetailSchemaType>({
  __v: { type: Number, select: false },
  _id: { type: String, select: false },
  showName: String,
  brand: String,
  silhoutte: String,
  styleID: { type: String, unique: true },
  image: String,
  image2: String,
  urlKey: String,
  spuId: Number,
  slug: String,
  lowestPrice: {
    stockx: Number,
    goat: Number,
    dewu: Number,
  },
  resellLinks: {
    stockX: String,
    goat: String,
    dewu: String,
  },
  sizeImage: String,
  sizePrices: {
    goat: Object,
    dewu: Object,
    stockx: Object,
  },
  images: [String],
  baseProperties: [],
  time: {
    type: Number,
    default: Date.now(),
  },
})

interface SearchDetailSchemaType extends SearchDetailType, mongoose.Document {}

export default mongoose.model<SearchDetailSchemaType>('Sneaker', SneakerSchema)
