import * as mongoose from 'mongoose'
import * as glob from 'glob'
import { resolve } from 'path'
import config from '../config'

const db = config.MONGODB_LINK

glob.sync(resolve(__dirname, '../models/', '**/*.js')).forEach(require)

export const dbconnect = () => {
  let maxConnectTimes = 0

  mongoose.set('useCreateIndex', true)

  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true)
  }

  mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  mongoose.connection.once('open', () => {
    console.log(`MongoDB Connected successfully! --> ${db}`)
  })

  mongoose.connection.on('disconnected', () => {
    if (maxConnectTimes++ < 1000) {
      console.log(`mongodb reconnect: ${maxConnectTimes}`)
      mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    } else {
      throw new Error('mongodb Connected fail!')
    }
  })

  mongoose.connection.on('error', (err) => {
    console.error(err)
  })
}
