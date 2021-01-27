import config from '../config'
import proxy_axios from '../utils/proxy_axios'
import { errorLog } from '../utils/common'
import { goatHeader } from '../utils/reqHeader'
import { GoatPricesType, GoatSearchDetailType } from '../types/global'

/**
 * API根据关键字搜索产品，获得产品link和lowestPrices
 *
 * @param {string} key 搜索关键字
 * @returns {Promise<GoatSearchDetailType>}
 */
export const goat_searchProduct = async (key: string): Promise<GoatSearchDetailType> => {
  try {
    const response = await proxy_axios.post<GoatSearchDetailType>(
      'https://2fwotdvm2o-2.algolianet.com/1/indexes/product_variants_v2/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.25.1&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a',
      {
        params: `distinct=true&facetFilters=(product_category%3A%20shoes)%2C%20()&facets=%5B%22size%22%5D&hitsPerPage=${config.SEARCH_LIMIT}&numericFilters=%5B%5D&page=0&query=${key}&clickAnalytics=true`,
      },
      {
        headers: goatHeader,
      },
    )

    const hits = response.data.hits
    hits && hits?.forEach((item) => (item.sku = item.sku.replace(/\s+/g, '-')))

    return response.data
  } catch (e) {
    console.error(e)
  }
}

/**
 * Goat-API获取当前Trending鞋子列表
 *
 * @returns {Promise<GoatSearchDetailType>}
 */
export const goat_getTrendingProduct = async (): Promise<GoatSearchDetailType> => {
  try {
    const response = await proxy_axios.post(
      'https://2fwotdvm2o-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.25.1%3BJS%20Helper%20(3.1.2)%3Breact%20(16.9.0)%3Breact-instantsearch%20(6.5.0)&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a',
      {
        requests: [
          {
            indexName: 'product_variants_v2_by_collection_order_asc',
            params: `highlightPreTag=<ais-highlight-0000000000>&highlightPostTag=</ais-highlight-0000000000>&distinct=true&filters=collection.slug:trending&maxValuesPerFacet=30&page=0&query=&facets=*&tagFilters=&hitsPerPage=${config.SEARCH_LIMIT}`,
          },
        ],
      },
      {
        headers: goatHeader,
      },
    )

    return response.data.results[0]
  } catch (e) {
    errorLog(e)
  }
}

/**
 * Goat-API根据slug获取产品各尺码价格
 *
 * @param {string} slug Goat鞋唯一slug
 * @returns {Promise<GoatPricesType>}
 */
export const goat_getProductPrice = async (slug: string): Promise<GoatPricesType> => {
  try {
    const response = await proxy_axios.get<GoatPricesType>(
      `https://www.goat.com/web-api/v1/product_variants?productTemplateId=${slug}`,
      {
        headers: goatHeader,
      },
    )

    return response.data
  } catch (e) {
    errorLog(e)
  }
}
