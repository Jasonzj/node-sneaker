import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'
import router from './middlewares/router'
import errorHandler from './middlewares/error'
import { dbconnect } from './middlewares/database'
import cors = require('koa2-cors')
import config from './config'

const app: Koa = new Koa()

// 连接mongodb
dbconnect()

// 注册中间件
app.use(cors())
app.use(logger())
app.use(errorHandler())
app.use(bodyParser())

// 装载所有子路由
router(app)

// 处理 404
app.use(async (ctx: Koa.Context) => {
  console.error(`404 ${ctx.message} : ${ctx.href}`)
  ctx.status = 404
  ctx.body = '404! content not found !'
})

const server = app.listen(config.port, () => {
  console.log(`server start --> ${config.port}`)
  if (config.proxy) console.log(`proxy start --> ${config.proxy_port}`)
})
server.setTimeout(30 * 1000)
