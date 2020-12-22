import { Context } from 'koa'
import { Controller, Auth, Post, Get, Put, Delete } from '../decorator/router'
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

@Controller(`${config.API_PREFIX}`)
export class UserRouter {
  @Post('/login')
  async login(ctx: Context): Promise<void> {
    const result = await login(ctx)

    ctx.body = {
      success: true,
      msg: 'Login Success',
      data: result,
    }
  }

  @Post('/register')
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

  @Get('/user')
  @Auth
  async getUserInfo(ctx: Context): Promise<void> {
    const result = await getUserInfo(ctx)

    ctx.body = {
      success: true,
      msg: 'Get User Info Success',
      data: result,
    }
  }

  @Put('/user/password')
  @Auth
  async updateUserPassword(ctx: Context): Promise<void> {
    const result = await updatePassword(ctx)

    ctx.body = {
      success: true,
      msg: 'Update Password Success',
      data: result,
    }
  }

  @Get('/user/following')
  @Auth
  async getUserFollowing(ctx: Context): Promise<void> {
    const result = await getFollowing(ctx)

    ctx.body = {
      success: true,
      msg: 'Get User Following Success',
      data: result,
    }
  }

  @Put('/user/following')
  @Auth
  async addUserFollowing(ctx: Context): Promise<void> {
    await follow(ctx)
  }

  @Delete('/user/following')
  @Auth
  async deleteUserFollowing(ctx: Context): Promise<void> {
    await unfollow(ctx)
  }
}
