import axios from 'axios'
import sign from '../utils/sign'
import config from '../config'
import { getDewuQueryStr } from '../utils/common'
import { errorLog } from '../utils/common'
import { dewuHeader } from '../utils/reqHeader'
import {
  DewuSearchDetailType,
  DewuInfoType,
  DewuPriceType,
  DewuSearchSuggestionType,
} from '../utils/type'

/**
 * Dewu-API根据关键字搜索产品信息
 *
 * @param {string} key  搜索关键字
 * @returns {Promise<DewuSearchDetailType>}
 */
export const dewu_searchProduct = async (key: string): Promise<DewuSearchDetailType> => {
  const queryStr = getDewuQueryStr({
    title: key || 'aj',
    page: 0,
    limit: config.dewuPageLimit,
    showHot: -1,
    sortType: 1,
    sortMode: 1,
    unionId: '',
  })

  try {
    const response = await axios.get(
      `https://app.poizon.com/api/v1/h5/search/fire/search/list?${queryStr}`,
      {
        headers: dewuHeader,
      },
    )

    const result = response.data.data
    // 筛选鞋子
    if (result.productList) {
      result.productList = result.productList.filter((item) => item.goodsType === 0)
    }
    return result
  } catch (e) {
    errorLog(e)
  }
}

/**
 * Dewu-API根据spuId获取产品详情
 *
 * @param {number} spuId dewu鞋唯一spuId
 * @returns {Promise<DewuInfoType>}
 */
export const dewu_getProductInfo = async (spuId: number): Promise<DewuInfoType> => {
  const signId = sign({
    spuId: spuId,
    productSourceName: '',
    propertyValueId: '0',
  })

  try {
    const response = await axios.post(
      'https://app.poizon.com/api/v1/h5/index/fire/flow/product/detail',
      {
        sign: signId,
        spuId: spuId,
        productSourceName: '',
        propertyValueId: '0',
      },
      {
        headers: dewuHeader,
      },
    )

    return response.data.data
  } catch (e) {
    errorLog(e)
  }
}

/**
 * Dewu-API根据spuId获取产品各尺码价格
 *
 * @param {number} spuId dewu鞋唯一spuId
 * @returns {Promise<DewuPriceType>}
 */
export const dewu_getProductPrice = async (spuId: number): Promise<DewuPriceType> => {
  const signId = sign({
    spuId: spuId,
  })

  try {
    const response = await axios.post(
      'https://app.dewu.com/api/v1/h5/inventory/price/h5/queryBuyNowInfo',
      {
        sign: signId,
        spuId: spuId,
      },
      {
        headers: dewuHeader,
      },
    )

    return response.data.data
  } catch (e) {
    errorLog(e)
  }
}

/**
 * DEWU-API根据关键字获取搜索关联详情(频繁)
 *
 * @param {string} key
 * @returns {Promise<DewuSearchSuggestionType>}
 */
export const dewu_getSuggestion = async (key: string): Promise<DewuSearchSuggestionType> => {
  const queryStr = getDewuQueryStr({
    title: key || 'aj',
  })

  try {
    const response = await axios.get(
      `https://app.poizon.com/api/v1/h5/search/fire/search/suggestion?${queryStr}`,
      {
        headers: dewuHeader,
      },
    )

    if (!response.data.data.list) return []
    return response.data.data.list
  } catch (e) {
    errorLog(e)
  }
}

/**
 * Dewu-API获取当前Trending鞋子列表
 *
 * @param {number} spuId dewu鞋唯一spuId
 * @returns {Promise<DewuSearchDetailType>}
 */
export const dewu_getTrendingProduct = async (): Promise<DewuSearchDetailType> => {
  const signId = sign({
    tabId: 4,
    limit: 20,
    lastId: '',
  })

  try {
    const response = await axios.post(
      'https://app.dewu.com/api/v1/h5/index/fire/shopping-tab',
      {
        sign: signId,
        tabId: 4,
        limit: 20,
        lastId: '',
      },
      {
        headers: dewuHeader,
      },
    )

    const result = response.data.data

    if (result.list) {
      const productList = result.list.map((item) => {
        return {
          ...item.product,
          minSalePrice: item.product.price,
        }
      })
      result.productList = productList
    }

    return result
  } catch (e) {
    errorLog(e)
  }
}
