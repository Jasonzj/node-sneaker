import { Context } from 'koa'
import { Controller, Auth, Post, Get, Put, Delete, VerifyParams } from '../decorator/router'
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

const userRules = {
  username: { type: 'string', required: true, min: 5, max: 20 },
  password: {
    type: 'string',
    required: true,
    min: 5,
    max: 20,
    format: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,}$/,
  },
}

@Controller(`${config.API_PREFIX}`)
export class UserRouter {
  @Post('/login')
  @VerifyParams(userRules)
  async login(ctx: Context): Promise<void> {
    const result = await login(ctx)

    ctx.body = {
      success: true,
      msg: 'Login Success',
      data: result,
    }
  }

  @Post('/register')
  @VerifyParams(userRules)
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
  @VerifyParams({
    password: { type: 'string', required: true },
  })
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
  @VerifyParams({
    styleId: { type: 'string', required: true },
  })
  @Auth
  async addUserFollowing(ctx: Context): Promise<void> {
    await follow(ctx)
  }

  @Delete('/user/following')
  @VerifyParams({
    styleId: { type: 'string', required: true },
  })
  @Auth
  async deleteUserFollowing(ctx: Context): Promise<void> {
    await unfollow(ctx)
  }
}
