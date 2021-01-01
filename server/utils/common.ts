import { AxiosError } from 'axios'
import proxy_axios from './proxy_axios'
import sign from './sign'
import { ExchangeRateType } from './type'

/**
 *  错误log
 *
 * @param {AxiosError} e
 */
export const errorLog = (e: AxiosError): void => {
  const err: AxiosError = e
  const response = err.response
  const error = new Error(
    `Error, url: ${err.config.url}, status: ${response && response.status}, text: ${
      response && response.statusText
    }
        }`,
  )
  console.log(error)
}

/**
 * 得物请求参数拼接
 *
 * @param {()} query
 * @returns
 */
export const getDewuQueryStr = (query: {
  [x: string]: string | number | boolean
  title?: string
  page?: number
  limit?: number
  showHot?: number
  sortType?: number
  sortMode?: number
  unionId?: string
  sign?: string
}): string => {
  query.sign = sign(query)
  return Object.keys(query)
    .map((key) => key + '=' + encodeURIComponent(query[key]))
    .join('&')
}

/**
 * 是否为空对象
 *
 * @param {(Record<string, unknown> | undefined)} o
 * @returns {boolean}
 */
export const isEmptyObject = (o: Record<string, unknown> | undefined | null): boolean => {
  if (!o) return true
  return Object.keys(o).length === 0
}

/**
 * 根据秒速暂停
 *
 * @param {number} time
 * @returns
 */
export const sleep = (time: number): Promise<boolean> =>
  new Promise((res) => setTimeout(() => res(true), time))

/**
 * 获取汇率
 *
 * @returns
 */
export const getExchangeRate = async (): Promise<number> => {
  const resultObj = await proxy_axios.get<ExchangeRateType>(
    `https://v6.exchangerate-api.com/v6/67574df5759b13896f8fd0f4/latest/USD`,
  )
  const result = resultObj.data.result
  const rate: number = resultObj.data.conversion_rates.CNY
  if (result === 'success') return rate
  return 1
}

/**
 * 尺码格式化
 *
 * @param {string} size
 * @returns
 */
export const formatSize = (size: string): string => {
  if (size.length > 2) {
    return `${size.slice(0, 2)}.5`
  }
  return size
}

/**
 * asyncLimit 异步并发控制
 * @param {Array} arr 请求数组
 * @param {Function} handler 请求处理函数要求返回Promise对象 ((...) => new Promise(...))
 * @param {Number} [limit=1]  并发数限制值
 * @returns {Promise}
 */
export function asyncLimit<T>(
  arr: T[],
  handler: (item: T) => Promise<void>,
  limit = 1,
): Promise<unknown> {
  const queue = Array.from(arr)
  const result = []
  let count = 0

  if (limit > arr.length) limit = arr.length

  if (typeof handler !== 'function') {
    throw new TypeError('handler is not a function')
  }

  return new Promise((res, rej) => {
    const next = (a?: number) => {
      if (queue.length <= 0 || count >= limit) return
      next(count++)
      handler(queue.shift())
        .then((data) => {
          next(count--)
          result.push(data)
          count === 0 && res(result)
        })
        .catch((err) => rej(err))
    }
    next()
  })
}
