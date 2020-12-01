import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import { UserInfoType } from '../../utils/type'
import config from '../../config'

const { Schema } = mongoose

const UserSchema = new Schema({
  __v: { type: Number, select: false },
  username: {
    unique: true,
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
  following: {
    type: Array,
    default: [],
    select: false,
  },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
})

UserSchema.pre<UserInfoSchemaType>('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

UserSchema.pre<UserInfoSchemaType>('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(+config.SALT_WORK_FACTOR)
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
    next()
  } catch (error) {
    return next(error)
  }
})

UserSchema.methods = {
  comparePassword(_password: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        err ? reject(err) : resolve(isMatch)
      })
    })
  },
}

interface UserInfoSchemaType extends UserInfoType, mongoose.Document {
  comparePassword: (_password: string, password: string) => Promise<boolean>
}

export default mongoose.model<UserInfoSchemaType>('User', UserSchema)
