import config from '../config'
import proxy_axios from '../utils/proxy_axios'
import { errorLog } from '../utils/common'
import { stockxHeader } from '../utils/reqHeader'
import {
  StockxPriceType,
  StockxSearchDetailType,
  StockxSearchSuggestionType,
  StockxHitsType,
} from '../utils/type'

/**
 * Stockx-API根据关键字获取搜索关联详情(频繁)
 *
 * @param {string} key 搜索关键字
 * @returns {Promise<StockxSearchDetailType>}
 */
export const stockx_getSuggestion = async (key: string): Promise<StockxHitsType> => {
  try {
    const response = await proxy_axios.post<StockxSearchSuggestionType>(
      'https://xw7sbct9v6-1.algolianet.com/1/indexes/products/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.32.1&x-algolia-application-id=XW7SBCT9V6&x-algolia-api-key=6bfb5abee4dcd8cea8f0ca1ca085c2b3',
      {
        params: `query=${key}&facets=*&filters=&hitsPerPage=${config.searchPageLimit}`,
      },
      {
        headers: stockxHeader,
      },
    )

    if (!response.data.hits) return []
    response.data.hits = response.data.hits.filter((item) => item.style_id)
    return response.data.hits
  } catch (e) {
    errorLog(e)
  }
}

/**
 * Stockx-API根据urlKey获取产品各尺码价格
 *
 * @param {*} urlKey stockx鞋唯一key
 * @returns {Promise<StockxPriceType>}
 */
export const stockx_getProductPrice = async (urlKey: string): Promise<StockxPriceType> => {
  try {
    const response = await proxy_axios.get<StockxPriceType>(
      `https://stockx.com/api/products/${urlKey}?includes=market`,
      {
        headers: stockxHeader,
      },
    )

    return response.data
  } catch (e) {
    errorLog(e)
  }
}

/**
 * Stockx-API根据关键字搜索产品信息
 *
 * @param {*} key 搜索关键字
 * @returns {Promise<StockxSearchDetailType>}
 */
export const stockx_searchProduct = async (key: string): Promise<StockxSearchDetailType> => {
  try {
    const response = await proxy_axios.get<StockxSearchDetailType>(
      'https://stockx.com/api/browse',
      {
        headers: stockxHeader,
        params: {
          productCategory: 'sneakers',
          _search: key,
          dataType: 'product',
        },
      },
    )

    const Products = response.data.Products
    if (Products) {
      return {
        ...response.data,
        Products: Products.slice(0, config.searchPageLimit),
      }
    }

    return response.data
  } catch (e) {
    errorLog(e)
  }
}
