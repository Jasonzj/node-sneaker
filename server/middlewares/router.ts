import * as Koa from 'koa'
import { Route } from '../decorator/router'
import { resolve } from 'path'

export default (app: Koa) => {
  const apiPath = resolve(__dirname, '../routes')
  const router: Route = new Route(app, apiPath)

  router.init()
}
