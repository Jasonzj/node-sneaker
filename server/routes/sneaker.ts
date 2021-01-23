import { Context } from 'koa'
import { Controller, Auth, Get } from '../decorator/router'
import config from '../config'
import {
  getProductPrice,
  getSomeProduct,
  getSearchDetail,
  getSuggestion,
} from '../services/sneaker'

@Controller(config.API_PREFIX)
export class SneaksRouter {
  @Get('/prices/:styleId')
  @Auth
  async getPrices(ctx: Context): Promise<void> {
    const { styleId } = ctx.params
    const result = await getProductPrice(styleId)

    ctx.body = {
      success: true,
      msg: 'Get Price Success ',
      data: result,
    }
  }

  @Get('/suggestions/:siteName/:keyWord')
  @Auth
  async getSearchRelevantStockx(ctx: Context): Promise<void> {
    const { keyWord, siteName } = ctx.params
    const result = await getSuggestion(keyWord, siteName)

    ctx.body = {
      success: true,
      msg: `Get ${siteName} Suggestions Success`,
      data: result,
    }
  }

  @Get('/search/:siteName/:keyWord')
  @Auth
  async getSearchProduct(ctx: Context): Promise<void> {
    const { keyWord, siteName } = ctx.params
    const { result, isDBSearch } = await getSearchDetail(keyWord, siteName)
    const success = Boolean(result.length)

    ctx.body = {
      success,
      msg: isDBSearch
        ? `Get ${siteName} Search Product Fail, Return DB Data`
        : `Get ${siteName} Search Product Success`,
      data: result,
      isDBSearch,
    }
  }

  @Get('/trending/:siteName')
  @Auth
  async getTrendingGoat(ctx: Context): Promise<void> {
    const { siteName } = ctx.params
    const { result, isDBSearch } = await getSearchDetail('', siteName)
    const success = Boolean(result.length)

    ctx.body = {
      success,
      msg: isDBSearch
        ? `Get ${siteName} Trending Fail, Return Data DB`
        : `Get ${siteName} Trending Success`,
      data: result,
      isDBSearch,
    }
  }

  @Get('/shoes')
  @Auth
  async getSomeShoe(ctx: Context): Promise<void> {
    const limit: number = parseInt(ctx.query.limit)
    const result = await getSomeProduct(limit)

    ctx.body = {
      success: true,
      data: result,
    }
  }
}
