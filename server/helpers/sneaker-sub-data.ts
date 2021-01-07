import config from '../config'
import { dewu_searchProduct } from '../scrapers/dewu'
import { goat_searchProduct } from '../scrapers/goat'
import { stockx_searchProduct } from '../scrapers/stock'
import { getExchangeRate, asyncLimit } from '../utils/common'
import {
  SearchDetailType,
  SearchDetailListType,
  GoatSearchDetailType,
  DewuSearchDetailType,
  StockxSearchDetailType,
} from '../types/global'

const goatDetailHandle = async (
  shoe: SearchDetailType,
  goatSearchResult: GoatSearchDetailType,
): Promise<void> => {
  if (goatSearchResult?.hits.length) {
    const goatLowestPrice = goatSearchResult.hits[0].lowest_price_cents_usd / 100
    shoe.lowestPrice.goat = goatLowestPrice || 100000
    shoe.resellLinks.goat += `${goatSearchResult.hits[0].slug}`
    shoe.slug = goatSearchResult.hits[0].slug
  }
}

const dewuDetailHandle = async (
  shoe: SearchDetailType,
  dewuSearchResult: DewuSearchDetailType,
  rate: number,
) => {
  if (dewuSearchResult?.productList.length) {
    const dewuLowestPrice = parseInt(
      (dewuSearchResult.productList[0].minSalePrice / 100 / rate).toFixed(),
    )
    shoe.lowestPrice.dewu = dewuLowestPrice || 10000
    shoe.spuId = dewuSearchResult.productList[0].spuId
    shoe.image = dewuSearchResult.productList[0].logoUrl
  }
}

const stockxDetailHandle = async (
  shoe: SearchDetailType,
  stockxSearchResult: StockxSearchDetailType | undefined,
) => {
  if (stockxSearchResult?.Products.length) {
    const stockxLowestPrice = stockxSearchResult.Products[0].market.lowestAsk
    shoe.lowestPrice.stockx = stockxLowestPrice || 10000
    shoe.resellLinks.stockX += `${stockxSearchResult.Products[0].urlKey}`
    shoe.urlKey = stockxSearchResult.Products[0].urlKey
    shoe.image2 = stockxSearchResult.Products[0].media.imageUrl
    shoe.brand = stockxSearchResult.Products[0].brand
  }
}

// 每个站点接口搜索对应的子搜索接口函数及处理函数数组
const childDetailFunMap = {
  stockx: [goat_searchProduct, dewu_searchProduct, goatDetailHandle, dewuDetailHandle],
  goat: [stockx_searchProduct, dewu_searchProduct, stockxDetailHandle, dewuDetailHandle],
  dewu: [goat_searchProduct, stockx_searchProduct, goatDetailHandle, stockxDetailHandle],
}

/**
 * sitename附属详情数据处理
 *
 * @param {SearchDetailListType} products 产品数组
 * @param {string} sitename 站点名字
 */
const childDetailHandle = async (products: SearchDetailListType, sitename: string) => {
  const rate = await getExchangeRate()
  const funs = childDetailFunMap[sitename] //根据sitename获取child数据处理函数
  const limit = sitename === 'dewu' ? config.DEWU_PAGE_LIMIT : config.CONCURRENT_LIMIT

  const loadChildDetail = async (shoe: SearchDetailType) => {
    const styleId = shoe.styleID
    const [searchFn1, searchFn2, handleFn1, handleFn2] = funs
    const results = await Promise.all([searchFn1(styleId), searchFn2(styleId)])
    const siteResult1: GoatSearchDetailType | StockxSearchDetailType = results[0]
    const siteResult2: DewuSearchDetailType | StockxSearchDetailType = results[1]
    handleFn1(shoe, siteResult1)
    handleFn2(shoe, siteResult2, rate)

    return
  }

  await asyncLimit<SearchDetailType>(products, loadChildDetail, limit)
}

export default childDetailHandle
