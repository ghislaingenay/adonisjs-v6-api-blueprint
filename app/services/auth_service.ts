import UserClient, { UserDto } from '#dtos/user'
import InternalServerException from '#exceptions/internal_server_error_exception'
import UnAuthorizedException from '#exceptions/un_authorized_exception'
import User from '#models/user'
import UserRepository from '#repo/user'
import env from '#start/env'
import { HttpResponse, UserLogin, UserRegistration } from '#types'
import jwt from 'jsonwebtoken'

export class AuthService {
  userRepo
  constructor() {
    this.userRepo = new UserRepository()
  }
  async registerWithPassword(
    body: UserRegistration & { provider: 'password' | 'google' }
  ): Promise<HttpResponse<User>> {
    const { trx, data: user } = await this.userRepo.create(body)
    await trx.commit()

    // SUPABASE - Create account
    // const { data, error } = await connector.auth.signUp({
    //   email: body.email,
    //   password: body.password,
    // })
    // const uid = data.user?.id
    // if (error) await trx.rollback()
    // else await trx.commit()

    // const updated = await autoCommit(this.userRepo.update(user.id, { uid }))

    return {
      result: true,
      data: user,
      message: 'Account created. Please login to continue',
    }
  }

  static verifyJwtToken(token?: string) {
    if (!token) return null
    try {
      return jwt.verify(token, env.get('SUPABASE_JWT_SECRET'), {
        algorithms: ['HS256'],
      })
    } catch (err) {
      return null
    }
  }

  async loginWithPassword(body: UserLogin): Promise<HttpResponse<{ token: string } & UserDto>> {
    const user = await User.verifyCredentials(body.email, body.password).catch(() => {
      throw new UnAuthorizedException('Email and/or password are incorrect')
    })
    if (!user) throw new UnAuthorizedException('Email and/or password are incorrect')
    // const authResponse = await connector.auth.signInWithPassword({
    //   email: body.email,
    //   password: body.password,
    // })
    // if (authResponse.error) throw new UnAuthorizedException('Email and/or password are incorrect')
    const userToken = await User.accessTokens.create(user)

    const userClient = new UserClient(user)
    return {
      result: true,
      data: {
        // authToken: authResponse.data.session.access_token,
        ...userClient.toJSON(),
        token: userToken.value!.release(),
      },
    }
  }

  async deleteToken(
    user: User,
    currentAccessToken: string
    // userJwt: string
  ): Promise<HttpResponse<{}>> {
    try {
      await User.accessTokens.delete(user, currentAccessToken)
      // await connector.auth.admin.signOut(userJwt)
      return {
        result: true,
        data: {},
        message: 'Logged out',
      }
    } catch (err) {
      throw new InternalServerException()
    }
  }
}
