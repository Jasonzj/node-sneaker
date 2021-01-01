import Sneaker from '../Dao/models/sneaker'
import { stockx_getSuggestion, stockx_searchProduct } from '../scrapers/stock'
import { goat_getTrendingProduct, goat_searchProduct } from '../scrapers/goat'
import { dewu_getSuggestion, dewu_getTrendingProduct, dewu_searchProduct } from '../scrapers/dewu'
import { isEmptyObject } from '../utils/common'
import { dbSearch, getSearchtDetailDb, SneakerUpdate, dbSearchByStyleId } from '../Dao/sneaker'
import {
  getGoatPrices,
  getDewuPrices,
  getStockxPrices,
  stockxSearchDataHandle,
  goatSearchDataHandle,
  dewuSearchDataHandle,
} from '../helpers/sneaker-data'
import {
  SearchDetailListType,
  SearchResultType,
  SiteNameType,
  DewuSearchSuggestionType,
  StockxHitsType,
} from '../utils/type'

// 站点搜索接口map
const searchInterfaceMap = {
  stockx: stockx_searchProduct,
  goat: goat_searchProduct,
  dewu: dewu_searchProduct,
  db: getSearchtDetailDb,
  trending_goat: goat_getTrendingProduct,
  trending_dewu: dewu_getTrendingProduct,
}

// 搜索结果处理map
const searchDataHandleMap = {
  stockx: stockxSearchDataHandle,
  goat: goatSearchDataHandle,
  dewu: dewuSearchDataHandle,
  trending_goat: goatSearchDataHandle,
  trending_dewu: dewuSearchDataHandle,
}

const suggestionInterfaceMap = {
  dewu: dewu_getSuggestion,
  stockx: stockx_getSuggestion,
}

const searhInterfaceArr = Object.keys(searchInterfaceMap)
const suggestionInterfaceArr = Object.keys(suggestionInterfaceMap)

/**
 * 获取搜索数据，以指定siteName的接口搜索为准
 * 搜索爬虫失败则直接返回数据库查询结果
 *
 * @param {string} keyWord 搜索关键字
 * @param {string} siteName 接口站点名字
 * @returns {Promise<SearchDetailListType>}
 */
export const getSearchtDetail = async (
  keyWord: string,
  siteName: SiteNameType,
): Promise<SearchResultType> => {
  if (!searhInterfaceArr.includes(siteName)) throw new Error('search interface sitename error')

  let isDBSearch = false
  const result = await searchInterfaceMap[siteName](keyWord)
  let searchResult: SearchDetailListType = []

  if (siteName === 'db') return result as SearchResultType

  if (result) {
    // @ts-ignore
    searchResult = await searchDataHandleMap[siteName](result) //搜索信息整合
    searchResult.forEach((shoe) => {
      const styleID = shoe.styleID
      SneakerUpdate(styleID, shoe)
    })
  } else {
    searchResult = await dbSearch(keyWord)
    isDBSearch = true
  }

  return {
    result: searchResult.filter((item) => item.styleID),
    isDBSearch,
  }
}

/**
 * 获取搜索建议数据，以指定siteName的接口搜索为准
 *
 * @param {string} keyWord
 * @param {SiteNameType} siteName
 * @returns
 */
export const getSuggestion = async (keyWord: string, siteName: SiteNameType) => {
  if (!suggestionInterfaceArr.includes(siteName))
    throw new Error('suggestion interface sitename error')

  const result: DewuSearchSuggestionType | StockxHitsType = await suggestionInterfaceMap[siteName](
    keyWord,
  )

  return result
}

/**
 * 获取dewu，stockx，goat整合产品价格数据
 * 获取价格失败直接返回数据库查询结果
 *
 * @param {PricesIdType} pricesId 所有平台鞋的id
 * @returns
 */
export const getProductPrice = async (styleId: string) => {
  const shoe = await dbSearchByStyleId(styleId)

  const [dewuPrices, stockxPrices, goatPrices] = await Promise.all([
    getDewuPrices(shoe.spuId),
    getStockxPrices(shoe.urlKey),
    getGoatPrices(shoe.slug),
  ])

  const dewuSizeLists = dewuPrices.sizeLists
  delete dewuPrices.sizeLists

  if (isEmptyObject(dewuSizeLists) && isEmptyObject(stockxPrices) && isEmptyObject(goatPrices)) {
    return shoe
  }

  const allProductSizeLists = {
    ...dewuPrices,
    time: Date.now(),
    sizePrices: {
      dewu: dewuSizeLists,
      stockx: stockxPrices,
      goat: goatPrices,
    },
  }

  SneakerUpdate(styleId, allProductSizeLists)

  return allProductSizeLists
}

/**
 * 从mongodb中获取指定数量鞋子数据
 *
 * @param {number} [limit=100]
 * @returns
 */
export const getSomeProduct = async (limit = 100) => {
  const allProductData = await Sneaker.find({}).limit(limit)
  return allProductData
}
