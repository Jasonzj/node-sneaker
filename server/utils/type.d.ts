import { Context } from 'koa'

type ExchangeRateType = {
  result: string
  conversion_rates: {
    CNY: number
  }
}

type DewuSkusType = {
  skuId: number
  spuId: number
  authPrice: number
  status: number
  properties: {
    level: number
    propertyValueId: number
  }[]
  price: number
}

type DewuPriceType = {
  skuInfoList: {
    skuId: number
    minPrice: number
    tradeType: number
    tradeChannelInfoList: []
    faqType: number
  }[]
  faqInfoList: {
    faqType: number
    exchangeDesc: string
    exchangeUrl: string
  }[]
  totalMinPrice: number
  serverTime: number
}

type DewuInfoType = {
  detail: {
    spuId: number
    isSelf: number
    categoryId: number
    level1CategoryId: number
    level2CategoryId: number
    brandId: number
    preSellStatus: number
    logoUrl: string
    title: string
    subTitle: string
    desc: string
    authPrice: number
    sellDate: string
    sourceName: string
    articleNumber: string
    preSellDeliverTime: number
    preSellLimitPurchase: number
    isShowPreSellTag: number
    isPreSellNew: number
    isShow: number
    crossStatus: number
    isShowCrossTag: number
    fitId: number
    goodsType: number
    deliverTime: number
    isSupportDeposit: number
    status: number
    isDel: number
    sellStatus: number
  }
  image: {
    spuImage: {
      images: {
        url: string
      }[]
      supportPanorama: string
    }
    imageLayoutType: string
  }
  baseProperties: {
    brandList: Record<string, string>[]
    list: Record<string, string>[]
  }
  saleProperties: {
    list: {
      propertyId: number
      name: string
      value: string
      propertyValueId: number
      level: number
      customValue: string
      showValue: number
      sort: number
      definitionId: number
      price: number
    }[]
  }
  item: {
    saleInventoryNo: string
    price: number
    type: number
    maxPrice: number
    tradeType: number
    skuId: number
    floorPrice: number
    upperPrice: number
    intentPrice: number
  }
  skus: DewuSkusType[]
  relationList: {
    spuId: number
    logoUrl: string
    title: string
    price: number
    soldNum: number
    propertyValueId: number
    requestId: string
    cn: string
    maxSalePrice: number
  }[]
  lastSoldList: {
    count: number
    list: []
  }
  favoriteList: { skuId: number; isAdded: number }[]
  couponList: []
  imageAndText: {
    type: string
    contentType: string
    images: {
      url: string
    }[]
    imageGap: boolean
  }[]
  instalment: {
    entryCopy: string
    floatingLayerInformation: string
    bottomInformation: string
    instalmentType: 1
    isShowInstalment: 0
    instalmentDesc: string
  }
  evaluate: {
    count: number
    type: number
    rateMsg: string
    sizeMsg: string
    commonSize: string
    sizes: []
  }
  kfInfo: {
    isShowKf: number
    kfRobotId: number
    kfRobotoId: number
    kfGroupId: number
    sourceName: string
  }
  advMidPriorityModel: {
    advDto: {
      advId: number
      title: string
      mediaType: number
      image: string
      redirect: []
      orderBy: number
    }
  }
  branding: {
    newUser: boolean
    image: string
    redirect: string
  }
  threeDLinkUrl: string
  shareLinkUrl: string
  miniShareLinkUrl: string
  hasSizeTable: true
  rank: {
    rankId: number
    rankIds: number[]
    title: string
    rankType: string
    seq: number
    themeType: number
  }
  serverTime: number
  brandFavorite: {
    brandId: number
    brandLogo: string
    brandName: string
    brandPostCount: number
    brandOfSpuCount: number
  }
  buyerRightsName: string[]
  isShowFq: boolean
}

type DewuSizePriceListType = {
  sizeLists: AnyStringObjectType
  images: string[]
  baseProperties: Record<string, string>[]
  sizeImage: string
}

type GoatPricesType = {
  size: number
  sizeOption: { presentation: string; value: number }
  shoeCondition: string
  boxCondition: string
  lowestPriceCents: { currency: string; amount: number; amountUsdCents: number }
  instantShipLowestPriceCents: { currency: string }
  lowestPriceCentsByWarehouse: []
}[]

type StockxPriceType = {
  Product: {
    id: string
    uuid: string
    brand: string
    colorway: string
    condition: string
    countryOfManufacture: string
    gender: string
    contentGroup: string
    minimumBid: number
    name: string
    primaryCategory: string
    secondaryCategory: string
    usHtsCode: string
    usHtsDescription: string
    productCategory: string
    retailPrice: number
    shoe: string
    shortDescription: string
    styleId: string
    tickerSymbol: string
    title: string
    dataType: string
    urlKey: string
    sizeLocale: string
    sizeTitle: string
    sizeDescriptor: string
    sizeAllDescriptor: string
    description: string
    lithiumIonBattery: boolean
    type: boolean
    aLim: number
    year: null
    shippingGroup: string
    traits: []
    meta: {
      charity: boolean
      raffle: boolean
      mobile_only: boolean
      restock: boolean
      deleted: boolean
      hidden: boolean
      lock_buying: boolean
      lock_selling: boolean
      redirected: boolean
    }
    PortfolioItems: []
    shipping: {
      totalDaysToShip: number
      hasAdditionalDaysToShip: boolean
      deliveryDaysLowerBound: number
      deliveryDaysUpperBound: number
    }
    enhancedImage: {
      productUuid: string
      imageKey: string
      imageCount: number
    }
    media: {
      '360': []
      imageUrl: string
      smallImageUrl: string
      thumbUrl: string
      has360: boolean
      gallery: []
    }
    charityCondition: number
    breadcrumbs: []
    market: {
      productId: number
      skuUuid: null
      productUuid: string
      lowestAsk: number
      lowestAskSize: null
      parentLowestAsk: number
      numberOfAsks: number
      hasAsks: number
      salesThisPeriod: number
      salesLastPeriod: number
      highestBid: number
      highestBidSize: null
      numberOfBids: number
      hasBids: number
      annualHigh: number
      annualLow: number
      deadstockRangeLow: number
      deadstockRangeHigh: number
      volatility: number
      deadstockSold: number
      pricePremium: number
      averageDeadstockPrice: number
      lastSale: number
      lastSaleSize: string
      salesLast72Hours: number
      changeValue: number
      changePercentage: number
      absChangePercentage: number
      totalDollars: number
      updatedAt: number
      lastLowestAskTime: number
      lastHighestBidTime: number
      lastSaleDate: string
      createdAt: string
      deadstockSoldRank: number
      pricePremiumRank: number
      averageDeadstockPriceRank: number
      featured: null
      lowestAskFloat: number
      highestBidFloat: number
    }
    children: {
      [propname: string]: {
        id: string
        uuid: string
        brand: string
        colorway: string
        condition: string
        countryOfManufacture: string
        gender: string
        contentGroup: string
        minimumBid: number
        name: string
        primaryCategory: string
        secondaryCategory: string
        usHtsCode: string
        usHtsDescription: string
        productCategory: string
        releaseDate: string
        retailPrice: number
        shoe: string
        shortDescription: string
        styleId: string
        tickerSymbol: string
        title: string
        dataType: string
        urlKey: string
        sizeLocale: string
        sizeTitle: string
        sizeDescriptor: string
        sizeAllDescriptor: string
        description: string
        lithiumIonBattery: boolean
        type: boolean
        aLim: number
        year: number
        shippingGroup: string
        market: {
          productId: number
          skuUuid: string
          productUuid: string
          lowestAsk: number
          lowestAskSize: number | string | null
          parentLowestAsk: number
          numberOfAsks: number
          hasAsks: number
          salesThisPeriod: number
          salesLastPeriod: number
          highestBid: number
          highestBidSize: null
          numberOfBids: number
          hasBids: null
          annualHigh: number
          annualLow: number
          deadstockRangeLow: number
          deadstockRangeHigh: number
          volatility: number
          deadstockSold: number
          pricePremium: number
          averageDeadstockPrice: number
          lastSale: number
          lastSaleSize: null
          salesLast72Hours: number
          changeValue: number
          changePercentage: number
          absChangePercentage: number
          totalDollars: number
          updatedAt: number
          lastLowestAskTime: number
          lastHighestBidTime: null
          lastSaleDate: null
          createdAt: string
          deadstockSoldRank: number
          pricePremiumRank: number
          averageDeadstockPriceRank: number
          featured: null
          lowestAskFloat: number
          highestBidFloat: number
        }
      }
    }
  }
}

type DewuSearchDetailType = {
  total: number
  page: number
  productList: [
    {
      requestId: string
      page: number
      dataType: number
      productId: number
      spuId: number
      propertyValueId: number
      propertyValue: string
      logoUrl: string
      images: []
      title: string
      subTitle: string
      spuMinSalePrice: number
      minSalePrice: number
      maxSalePrice: number
      soldNum: number
      price: number
      brandLogoUrl: string
      articleNumber: string
      priceType: number
      goodsType: number
      type: number
      isBrandPrice: number
      brandDirectSupply: number
    },
  ]
  sizes: []
  showHotProduct: number
  isShowGeneral: number
  requestId: string
  allowOriginSearch: number
}

type DewuSearchSuggestionType = {
  id: number
  word: string
  highLight: string
  combinationMd5: string
  requestId: string
  searchNum: number
  hitCount: number
}[]

type StockxHitsType = {
  name: string
  brand: string
  thumbnail_url: string
  media: {
    imageUrl: string
  }
  grid_glow_picture_url: string
  url: string
  release_date: string
  categories: [][]
  product_category: string
  ticker_symbol: string
  style_id: string
  make: string
  model: string
  short_description: string
  gender: string
  colorway: string
  price: number
  description: string
  highest_bid: number
  total_dollars: number
  lowest_ask: number
  last_sale: number
  sales_last_72: number
  deadstock_sold: number
  quality_bid: number
  active: number
  new_release: null
  featured: null
  lock_selling: boolean
  selling_countries: [][]
  buying_countries: [][]
  traits: [][]
  objectID: string
}[]

type StockxSearchSuggestionType = {
  hits: StockxHitsType
  nbHits: number
  page: number
  nbPages: number
  hitsPerPage: number
  facets: {
    lowest_ask: AnyStringObjectType
    quality_bid: AnyStringObjectType
    'media.imageUrl': AnyStringObjectType
    buying_countries: AnyStringObjectType
    product_category: AnyStringObjectType
    selling_countries: AnyStringObjectType
  }
  facets_stats: {
    lowest_ask: { min: number; max: number; avg: number; sum: number }
    quality_bid: { min: number; max: number; avg: number; sum: number }
  }
  exhaustiveFacetsCount: boolean
  exhaustiveNbHits: boolean
  query: string
  params: string
  processingTimeMS: number
}

type StockxSearchDetailType = {
  Pagination: {
    limit: number
    page: number
    total: number
    lastPage: string
    sort: string[]
    order: string[]
    currentPage: string
    nextPage: string
    previousPage: null
  }
  Products: {
    id: string
    uuid: string
    brand: string
    breadcrumbs: any[]
    category: string
    charityCondition: number
    childId: null
    colorway: string
    condition: string
    countryOfManufacture: string
    dataType: string
    description: string
    hidden: boolean
    listingType: string
    minimumBid: number
    gender: string
    doppelgangers: any[]
    media: {
      imageUrl: string
      smallImageUrl: string
      thumbUrl: string
      gallery: any[]
      hidden: boolean
    }
    name: string
    productCategory: string
    releaseDate: Date
    releaseTime: number
    belowRetail: boolean
    retailPrice: number
    shoe: string
    shortDescription: string
    styleId: string
    tickerSymbol: string
    title: string
    traits: {
      name: string
      value: number | string
      filterable: boolean
      visible: boolean
      highlight: boolean
    }[]
    type: number
    urlKey: string
    year: number
    shoeSize: null
    market: {
      productId: number
      skuUuid: string
      productUuid: string
      lowestAsk: number
      lowestAskSize: string
      parentLowestAsk: number
      numberOfAsks: number
      hasAsks: number
      salesThisPeriod: number
      salesLastPeriod: number
      highestBid: number
      highestBidSize: string
      numberOfBids: number
      hasBids: number
      annualHigh: number
      annualLow: number
      deadstockRangeLow: number
      deadstockRangeHigh: number
      volatility: number
      deadstockSold: number
      pricePremium: number
      averageDeadstockPrice: number
      lastSale: number
      lastSaleSize: string
      salesLast72Hours: number
      changeValue: number
      changePercentage: number
      absChangePercentage: number
      totalDollars: number
      lastLowestAskTime: number
      lastHighestBidTime: number
      lastSaleDate: Date
      createdAt: Date
      updatedAt: number
      deadstockSoldRank: number
      pricePremiumRank: number
      averageDeadstockPriceRank: number
      featured: number
    }
    _tags: string[]
    lock_selling: boolean
    objectID: string
  }[]
}

type GoatSearchDetailType = {
  hits: {
    name: string
    product_template_id: number
    shoe_condition: string
    box_condition: string
    lowest_price_cents: number
    instant_ship_lowest_price_cents: number
    brand_name: string
    retail_price_cents: number
    silhouette: string
    single_gender: string
    size_brand: string
    size_range: []
    sku: string
    slug: string
    special_display_price_cents: number
    special_type: string
    status: string
    story_html: string
    upper_material: string
    collection_slugs: []
    has_stock: boolean
    size: number
    presentation_size: string
    release_year: number
    is_wantable: boolean
    id: number
    is_under_retail: boolean
    is_fashion_product: boolean
    is_raffle_product: boolean
    resellable: boolean
    lowest_price_cents_usd: number
    instant_ship_lowest_price_cents_usd: number
    retail_price_cents_usd: number
    lowest_price_cents_aud: number
    instant_ship_lowest_price_cents_aud: number
    retail_price_cents_aud: number
    lowest_price_cents_cad: number
    instant_ship_lowest_price_cents_cad: number
    retail_price_cents_cad: number
    lowest_price_cents_cny: number
    instant_ship_lowest_price_cents_cny: number
    retail_price_cents_cny: number
    lowest_price_cents_eur: number
    instant_ship_lowest_price_cents_eur: number
    retail_price_cents_eur: number
    lowest_price_cents_gbp: number
    instant_ship_lowest_price_cents_gbp: number
    retail_price_cents_gbp: number
    lowest_price_cents_hkd: number
    instant_ship_lowest_price_cents_hkd: number
    retail_price_cents_hkd: number
    lowest_price_cents_sgd: number
    instant_ship_lowest_price_cents_sgd: number
    retail_price_cents_sgd: number
    lowest_price_cents_twd: number
    instant_ship_lowest_price_cents_twd: number
    retail_price_cents_twd: number
    lowest_price_cents_jpy: number
    instant_ship_lowest_price_cents_jpy: number
    retail_price_cents_jpy: number
    lowest_price_cents_krw: number
    instant_ship_lowest_price_cents_krw: number
    retail_price_cents_krw: number
    objectID: string
    _highlightResult: []
  }[]
  nbHits: number
  page: number
  nbPages: number
  hitsPerPage: number
}

interface SearchDetailType {
  showName?: string
  brand?: string
  silhoutte?: string
  styleID?: string
  image?: string
  image2?: string
  urlKey?: string //stockx获取价格key
  spuId?: number //得物获取价格ID
  slug?: string //goat获取价格ID
  lowestPrice?: {
    stockx: number
    goat: number
    dewu: number
  }
  resellLinks?: {
    stockX: string
    goat: string
    dewu: string
  }
  images?: string[]
  sizeImage?: string
  baseProperties?: Record<string, string>[]
  time?: number
  sizePrices?: {
    dewu?: AnyStringObjectType
    stockx?: AnyStringObjectType
    goat?: AnyStringObjectType
  }
}

type SearchDetailListType = SearchDetailType[]

type SearchResultType = {
  result: SearchDetailType[]
  isDBSearch: boolean
}

type SiteNameType = 'goat' | 'stockx' | 'dewu' | 'db' | 'trending_dewu' | 'trending_goat'

type UserInfoType = {
  username: string
  password: string
  following: string[]
  meta: { createdAt: number; updatedAt: number }
}

type AnyStringObjectType = {
  [propname: string]: number
}

type AnyObjectType = {
  [propname: string]: unknown
}

type RouterCallbackType = (ctx: Context) => Promise<void>

type routerMap = {
  path: string
  method: string
  target: ClassDecorator
  callback: RouterCallbackType[]
}

export {
  DewuPriceType,
  StockxPriceType,
  GoatPricesType,
  DewuSearchDetailType,
  DewuSearchSuggestionType,
  GoatSearchDetailType,
  StockxHitsType,
  StockxSearchDetailType,
  StockxSearchSuggestionType,
  SearchDetailType,
  AnyStringObjectType,
  routerMap,
  DewuSkusType,
  DewuInfoType,
  DewuSizePriceListType,
  SearchResultType,
  SiteNameType,
  SearchDetailListType,
  UserInfoType,
  AnyObjectType,
  RouterCallbackType,
  ExchangeRateType,
}
