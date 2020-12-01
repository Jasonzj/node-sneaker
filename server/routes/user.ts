import { Context } from 'koa'
import { Controller, post, get, put, del } from '../decorator/router'
import {
  follow,
  createUser,
  getUserInfo,
  login,
  unfollow,
  getFollowing,
  updatePassword,
} from '../services/user'
import config from '../config'

@Controller(`${config.apiPrefix}`)
export class UserRouter {
  @post('/login')
  async login(ctx: Context): Promise<void> {
    const result = await login(ctx)

    ctx.body = {
      success: true,
      msg: 'Login Success',
      data: result,
    }
  }

  @post('/register')
  async register(ctx: Context): Promise<void> {
    const result = await createUser(ctx)

    ctx.body = {
      success: true,
      msg: 'Register Success',
      data: {
        username: result.username,
      },
    }
  }

  @get('/user')
  async getUserInfo(ctx: Context): Promise<void> {
    const result = await getUserInfo(ctx)

    ctx.body = {
      success: true,
      msg: 'Get User Info Success',
      data: result,
    }
  }

  @put('/user/password')
  async updateUserPassword(ctx: Context): Promise<void> {
    const result = await updatePassword(ctx)

    ctx.body = {
      success: true,
      msg: 'Update Password Success',
      data: result,
    }
  }

  @get('/user/following')
  async getUserFollowing(ctx: Context): Promise<void> {
    const result = await getFollowing(ctx)

    ctx.body = {
      success: true,
      msg: 'Get User Following Success',
      data: result,
    }
  }

  @put('/user/following')
  async addUserFollowing(ctx: Context): Promise<void> {
    await follow(ctx)
  }

  @del('/user/following')
  async deleteUserFollowing(ctx: Context): Promise<void> {
    await unfollow(ctx)
  }
}
