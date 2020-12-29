import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'
import router from './middlewares/router'
import errorHandler from './middlewares/error'
import { dbconnect } from './middlewares/database'
import cors = require('koa2-cors')
import parameter = require('koa-parameter')
import config from './config'

const app: Koa = new Koa()

// 连接mongodb
dbconnect()

// 注册中间件
app.use(cors())
app.use(logger())
app.use(errorHandler())
app.use(bodyParser())
parameter(app)

// 装载所有子路由
router(app)

const server = app.listen(config.PORT, () => {
  console.log(`server start --> ${config.PORT}`)
  if (config.PROXY_PORT) console.log(`proxy start --> ${config.PROXY_PORT}`)
})
server.setTimeout(config.REQUIRE_TIMEOUT * 1000)
