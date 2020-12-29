import * as Router from 'koa-router'
import * as glob from 'glob'
import * as Koa from 'koa'
import * as jwtKoa from 'koa-jwt'
import { resolve } from 'path'
import { routerMap } from '../utils/type'
import config from '../config'

const pathPrefix = Symbol('prefix') // 路径前缀
const routerMap: routerMap[] = []

const changeToArr = (arr: [] | Koa.Middleware): Koa.Middleware[] =>
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

export const convert = (middleware: Koa.Middleware) => (target: any, key: string): void => {
  target[key] = [middleware, ...changeToArr(target[key])]
}

export const setRouter = (method: string) => (path: string) => (
  target: any,
  key: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor => {
  routerMap.push({
    target,
    method,
    path: normalizePath(path),
    callback: changeToArr(target[key]),
  })
  return descriptor
}

export const Controller = (path: string): ClassDecorator => (constructor) => {
  constructor.prototype[pathPrefix] = path
}

export const Get = setRouter('get')
export const Post = setRouter('post')
export const Put = setRouter('put')
export const Patch = setRouter('patch')
export const Delete = setRouter('delete')

export const Auth = convert(jwtKoa({ secret: config.JWT_SECRET }))
export const VerifyParams = (rules: Record<string, any>) =>
  convert(async (ctx, next) => {
    ctx.verifyParams(rules)
    await next()
  })
