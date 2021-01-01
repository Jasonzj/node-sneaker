import childDetailHandle from './sneaker-sub-data'
import { dewu_getProductInfo, dewu_getProductPrice } from '../scrapers/dewu'
import { stockx_getProductPrice } from '../scrapers/stock'
import { goat_getProductPrice } from '../scrapers/goat'
import { getExchangeRate, formatSize, isEmptyObject } from '../utils/common'
import {
  DewuSkusType,
  DewuSizePriceListType,
  GoatSearchDetailType,
  StockxSearchDetailType,
  SearchDetailListType,
  GoatPricesType,
  StockxPriceType,
  DewuSearchDetailType,
} from '../utils/type'

/**
 * 获取Stockx指定urlKey的鞋的所有尺码价格列表
 *
 * @param {string} [urlKey='']  stockx鞋唯一key
 * @returns {Promise<Record<string, number>>}
 * sizeLists{
 *  '5.5': 100,
 *  '6': 120
 * }
 */
export const getStockxPrices = async (urlKey = ''): Promise<Record<string, number>> => {
  const sizeLists: Record<string, number> = {}
  const stockxPrices: StockxPriceType = await stockx_getProductPrice(urlKey)

  if (!stockxPrices) return sizeLists // 请求stockx价格失败直接返回{}

  const stockxSizeList = stockxPrices.Product.children

  for (const key in stockxSizeList) {
    const sizeItem = stockxSizeList[key].market
    const size = sizeItem.lowestAskSize
    const formatSize = typeof size === 'string' ? size.replace(/[a-zA-Z]/g, '') : size
    const price = sizeItem.lowestAsk
    if (size) sizeLists[formatSize] = price
  }

  return sizeLists
}

/**
 * 获取Dewu指定spuId的鞋的所有尺码价格列表
 *
 * @param {number} [spuId=0] dewu鞋唯一spuId
 * @returns {Promise<DewuSizePriceListType>}
 * {
 *   sizeLists: {
 *     '5.5': 100,
 *     '6': 120
 *   },
 *   ...
 * }
 */
export const getDewuPrices = async (spuId = 0): Promise<DewuSizePriceListType> => {
  const [info, prices] = await Promise.all([
    dewu_getProductInfo(spuId),
    dewu_getProductPrice(spuId),
  ])

  if (isEmptyObject(info) || isEmptyObject(prices)) {
    return {
      sizeImage: '',
      sizeLists: {},
      images: [],
      baseProperties: [],
    }
  }

  // sizeList
  const skus: DewuSkusType[] = info.skus
  const saleProperties = info.saleProperties.list

  const skuIdPrice: Record<string, number> = {}
  const propertyValueIdPrice: Record<string, number> = {}

  prices.skuInfoList.forEach((item) => {
    skuIdPrice[item.skuId] = item.minPrice / 100
  })

  skus.forEach((item) => {
    const skuId = item.skuId
    const propertyValueId = item.properties[0].propertyValueId
    const price = skuIdPrice[skuId]
    if (price) {
      item.price = price
      propertyValueIdPrice[propertyValueId] = price
    }
  })

  const sizeLists: Record<string, number> = {}
  const rate = await getExchangeRate()

  saleProperties.forEach((item) => {
    const propertyValueId = item.propertyValueId
    const price = parseInt((propertyValueIdPrice[propertyValueId] / rate).toFixed())
    const size = formatSize(item.value)
    if (price) {
      sizeLists[size] = price
      return true
    }
  })

  // Other
  const images: string[] = info.image.spuImage.images.map((item) => item.url)
  const baseProperties = info.baseProperties.list

  // SizeTemplate
  const SizeTemplate = info.imageAndText.filter((item) => item.contentType === 'SIZETEMPLATE')
  let sizeImage = ''
  if (SizeTemplate[0]) {
    sizeImage = SizeTemplate[0].images[0].url
  }

  return {
    sizeImage,
    sizeLists,
    images,
    baseProperties,
  }
}

/**
 * 获取Goat指定spuId的鞋的所有尺码价格列表
 *
 * @param {string} [slug=''] Goat鞋唯一slug
 * @returns {Promise<Record<string, number>>}
 * sizeLists{
 *  '5.5': 100,
 *  '6': 120
 * }
 */
export const getGoatPrices = async (slug = ''): Promise<Record<string, number>> => {
  const sizeLists: Record<string, number> = {}
  const goatPrices: GoatPricesType = await goat_getProductPrice(slug) // 请求goat价格失败直接返回{}

  if (!goatPrices) return sizeLists

  goatPrices.forEach((item) => {
    sizeLists[item.size] = item.lowestPriceCents.amount / 100
  })

  return sizeLists
}

/**
 * 根据stockx搜索结果整理出需要的数据
 *
 * @param {StockxSearchDetailType} data stockx 搜索结果
 * @returns {Promise<SearchDetailListType>}
 */
export const stockxSearchDataHandle = async (
  data: StockxSearchDetailType,
): Promise<SearchDetailListType> => {
  const products: SearchDetailListType = []
  if (!data.Products) return products
  data.Products.forEach((item) => {
    products.push({
      showName: item.name,
      brand: item.brand,
      silhoutte: '',
      styleID: item.styleId,
      image: '',
      image2: item.media.imageUrl,
      urlKey: item.urlKey,
      spuId: 0,
      slug: '',
      lowestPrice: {
        stockx: item.market.lowestAsk || 100000,
        goat: 100000,
        dewu: 100000,
      },
      resellLinks: {
        stockX: 'https://stockx.com/' + item.urlKey,
        goat: 'https://www.goat.com/sneakers/',
        dewu: '',
      },
      time: Date.now(),
    })
  })

  await childDetailHandle(products, 'stockx')
  return products
}

/**
 * 根据goat搜索结果整理出需要的数据
 *
 * @param {GoatSearchDetailType} data goat搜索结果
 * @returns {Promise<SearchDetailListType>}
 */
export const goatSearchDataHandle = async (
  data: GoatSearchDetailType,
): Promise<SearchDetailListType> => {
  const products: SearchDetailListType = []
  if (!data.hits) return products
  data.hits.forEach((item) => {
    products.push({
      showName: item.name,
      brand: item.brand_name,
      silhoutte: item.silhouette,
      styleID: item.sku,
      image: '',
      image2: '',
      urlKey: '',
      spuId: 0,
      slug: item.slug,
      lowestPrice: {
        stockx: 10000,
        goat: item.lowest_price_cents_usd / 100,
        dewu: 10000,
      },
      resellLinks: {
        stockX: 'https://stockx.com/',
        goat: `https://www.goat.com/sneakers/${item.slug}`,
        dewu: '',
      },
      time: Date.now(),
    })
  })

  await childDetailHandle(products, 'goat')
  return products
}

/**
 * 根据dewu搜索结果整理出需要的数据
 *
 * @param {DewuSearchDetailType} data goat搜索结果
 * @returns {Promise<SearchDetailListType>}
 */
export const dewuSearchDataHandle = async (
  data: DewuSearchDetailType,
): Promise<SearchDetailListType> => {
  const products: SearchDetailListType = []
  if (!data.productList) return products
  const rate = await getExchangeRate()
  data.productList.forEach((item) => {
    const dewuLowestPrice = parseInt((item.minSalePrice / 100 / rate).toFixed())
    products.push({
      showName: item.title,
      brand: '',
      silhoutte: '',
      styleID: item.articleNumber,
      image: item.logoUrl,
      image2: '',
      urlKey: '',
      spuId: item.spuId,
      slug: '',
      lowestPrice: {
        stockx: 10000,
        goat: 10000,
        dewu: dewuLowestPrice,
      },
      resellLinks: {
        stockX: 'https://stockx.com/',
        goat: `https://www.goat.com/sneakers/`,
        dewu: '',
      },
      time: Date.now(),
    })
  })

  await childDetailHandle(products, 'dewu')
  return products
}
