import { Context, Next } from 'koa'

// 这个middleware处理在其它middleware中出现的异常，除了scrapers
// 并将异常消息回传给客户端：{ success: '请求状态', msg: '错误信息' }

type ResData = {
  success: boolean
  msg?: string
  err?: Record<string, any>
}

const errorHandler = () => async (ctx: Context, next: Next) => {
  try {
    await next()
  } catch (err) {
    const obj: ResData = {
      success: false,
      msg: err.message || 'System Error',
    }

    if (ctx.app.env === 'development') obj.err = err

    ctx.status = err.statusCode || err.status || err.response?.status || 500
    ctx.body = obj
  }
}

export default errorHandler
