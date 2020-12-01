import Sneaker from './models/sneaker'
import { SearchDetailType, SearchDetailListType, SearchResultType } from '../utils/type'

/**
 * mongoose查询数据-根据keyWord匹配查找
 *
 * @param {string} keyWord 搜索关键词
 * @returns {Promise<SearchDetailListType>} 鞋子数据列表
 */
export const dbSearch = async (keyWord: string): Promise<SearchDetailListType> => {
  const reg = new RegExp(keyWord, 'i')

  const result: SearchDetailListType = await Sneaker.find({
    $or: [
      { showName: { $regex: reg } },
      { make: { $regex: reg } },
      { styleID: { $regex: reg } },
      { brand: { $regex: reg } },
      { urlKey: { $regex: reg } },
      { slug: { $regex: reg } },
    ],
  }).lean()

  return result
}

/**
 * mongoose查询数据-根据StyleId匹配查找
 *
 * @param {string} styleId
 * @returns {Promise<SearchDetailType>} 鞋子数据
 */
export const dbSearchByStyleId = async (styleId: string): Promise<SearchDetailType> => {
  const result: SearchDetailType = await Sneaker.findOne({ styleID: styleId })
  return result
}

/**
 * 获取搜索数据，以db搜索为准
 *
 * @param {string} keyWord 搜索关键字
 * @returns {Promise<SearchResultType>}
 */
export const getSearchtDetailDb = async (keyWord: string): Promise<SearchResultType> => {
  const searchResult = await dbSearch(keyWord)
  return {
    result: searchResult.filter((item) => item.styleID),
    isDBSearch: false,
  }
}

/**
 * mongoose更新数据-根据styleID匹配更新
 * 无就新建，有就更新
 *
 * @param {string} styleID
 * @param {(SearchDetailType} data 需要更新的数据
 */
export const SneakerUpdate = (styleID: string, data: SearchDetailType): void => {
  Sneaker.updateOne(
    { styleID: styleID },
    data,
    {
      upsert: true,
    },
    (err) => {
      if (err) console.log(err)
    },
  )
}
