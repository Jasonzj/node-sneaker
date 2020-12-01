import * as Router from 'koa-router'
import * as glob from 'glob'
import * as Koa from 'koa'
import { resolve } from 'path'
import { RouterCallbackType, routerMap } from '../utils/type'

const pathPrefix = Symbol('prefix') // 路径前缀
const routerMap: routerMap[] = []

const changeToArr = (arr: [] | RouterCallbackType): RouterCallbackType[] =>
  Array.isArray(arr) ? arr : [arr]
const normalizePath = (path: string): string => (path.startsWith('/') ? path : `/${path}`)

export class Route {
  app: Koa
  router: Router
  routersPath: string

  constructor(app: Koa, routersPath: string) {
    this.app = app // koa对象
    this.routersPath = routersPath // 路由文件夹路径
    this.router = new Router() // koa-router对象
  }

  init(): void {
    const { app, router, routersPath } = this

    glob.sync(resolve(routersPath, './*.{js,ts}')).forEach(require) // 执行routes下所有文件

    routerMap.forEach(({ path, target, method, callback }) => {
      const prefix = normalizePath(target[pathPrefix]) // 格式化路径
      router[method](prefix + path, ...callback) // 注册路由
    })

    app.use(router.routes()).use(router.allowedMethods())
  }
}

// export const convert = (middleware: Function) => (target: any, key: string): void => {
//   target[key] = [middleware, ...changeToArr(target[key])]
// }

export const setRouter = (method: string) => (path: string) => (target: any, key: string): void => {
  routerMap.push({
    target,
    method,
    path: normalizePath(path),
    callback: changeToArr(target[key]),
  })
}

export const Controller = (path: any) => (target) => (target.prototype[pathPrefix] = path)
export const get = setRouter('get')
export const post = setRouter('post')
export const put = setRouter('put')
export const patch = setRouter('patch')
export const del = setRouter('delete')
