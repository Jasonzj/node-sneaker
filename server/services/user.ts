import User from '../Dao/models/user'
import Sneaker from '../Dao/models/sneaker'
import * as jsonwebtoken from 'jsonwebtoken'
import config from '../config'
import { Context } from 'koa'

/**
 * 登入
 *
 * @param {Context} ctx
 * @returns
 */
export const login = async (ctx: Context) => {
  const { username, password } = ctx.request.body
  const user = await User.findOne({ username }).select('password')

  if (!user) ctx.throw(401, 'username or passwoad is wrong')

  const match = await user.comparePassword(password, user.password)

  if (!match) ctx.throw(401, 'username or passwoad is wrong')

  const token = jsonwebtoken.sign({ username, id: user._id }, config.JWT_SECRET, {
    expiresIn: '7d',
  })

  return {
    username,
    token,
  }
}

/**
 * 创建用户
 *
 * @param {Context} ctx
 * @returns
 */
export const createUser = async (ctx: Context) => {
  const { username } = ctx.request.body
  const user = await User.findOne({ username })

  if (user) ctx.throw(409, 'username already exists')

  return await new User(ctx.request.body).save()
}

/**
 * 修改密码
 *
 * @param {Context} ctx
 */
export const updatePassword = async (ctx: Context) => {
  const { id } = ctx.state.user
  const { password } = ctx.request.body
  const user = await User.findById(id)

  if (!user) ctx.throw(404, 'not found the user')

  user.password = password
  user.save()

  ctx.status = 204
}

/**
 * 获得用户信息
 *
 * @param {Context} ctx
 * @returns
 */
export const getUserInfo = async (ctx: Context) => {
  const { id } = ctx.state.user
  const user = await User.findById(id)

  if (!user) ctx.throw(404, 'not found the user')

  return user
}

/**
 * 获得关注列表
 *
 * @param {Context} ctx
 * @returns
 */
export const getFollowing = async (ctx: Context) => {
  const { id } = ctx.state.user
  const { isDetail } = ctx.query
  const user = await User.findById(id).select('following')

  if (!user) ctx.throw(404, 'not found the user')

  if (isDetail !== 'true') {
    return user.following
  }

  const following = await Sneaker.find({ styleID: { $in: user.following } }).select(
    '-sizeImage -sizeLists -images -baseProperties',
  )

  if (!following.length) ctx.throw(404, 'the list of following is empty')

  return following
}

/**
 * 关注
 *
 * @param {Context} ctx
 */
export const follow = async (ctx: Context) => {
  const { id } = ctx.state.user
  const { styleId } = ctx.request.body
  const user = await User.findById(id).select('following')

  if (!user.following.includes(styleId)) {
    user.following.push(styleId)
    user.save()
  }

  ctx.status = 204
}

/**
 * 取消关注
 *
 * @param {Context} ctx
 */
export const unfollow = async (ctx: Context) => {
  const { id } = ctx.state.user
  const { styleId } = ctx.request.body

  await User.updateOne(
    { _id: id },
    {
      $pull: {
        following: styleId,
      },
    },
  )

  ctx.status = 204
}
