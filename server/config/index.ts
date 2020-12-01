import development from './env/development'
import production from './env/production'
import * as dotenv from 'dotenv'
import { join } from 'path'

// 环境变量注入
const result = dotenv.config({ path: join(__dirname, '../../variables.env') })
console.log(`${result.error ? 'env loaded fail or empty' : 'env loaded success'}`)

const isProd = process.env.NODE_ENV === 'production'
const env = isProd ? production : development

Object.keys(env).forEach((key) => {
  env[key] = process.env[key] || env[key]
})

Object.keys(process.env).forEach((key) => {
  env[key] = process.env[key]
})

const Environment: config = env

export default Environment

type config = {
  port: number
  apiPrefix: string
  searchPageLimit: number
  concurrentLimit: number
  dewuPageLimit: number
  dewuConcurrentLimit: number
  proxy?: boolean
  proxy_port?: number
  MONGODB_LINK?: string
  JWT_SECRET?: string
  SALT_WORK_FACTOR?: string
}
