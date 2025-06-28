import ForbiddenException from '#exceptions/forbidden_exception'
import NotFoundException from '#exceptions/not_found_exception'
import User from '#models/user'
import UserRepository from '#repo/user'
import { generateCode } from '#utils/http/crypto'
import { redis } from 'app/definitions/redis.js'
import { DateTime } from 'luxon'

const EMAIL_VERIFY_TOKEN_PREFIX = 'email_verify_token:'
const EMAIL_VERIFY_USER_PREFIX = 'email_verify_token:'
const EXPIRATION_TIME = 900 // 15 minutes
export class EmailVerificationService {
  userRepository
  constructor() {
    this.userRepository = new UserRepository()
  }

  private userCanBeVerified(user: User) {
    if (user.provider !== 'password') throw new ForbiddenException('User not found')
    if (user.isVerified) throw new ForbiddenException('User already verified')
    if (user.verifiedAt) throw new ForbiddenException('User already verified')
    return true
  }

  private async createVerificationToken(userId: number, token: string) {
    const existingToken = await redis.get(`${EMAIL_VERIFY_USER_PREFIX}:${userId}`)
    if (existingToken) {
      await redis.del(`${EMAIL_VERIFY_TOKEN_PREFIX}:${existingToken}`)
    }
    await redis.set(`${EMAIL_VERIFY_USER_PREFIX}:${userId}`, token, 'EX', EXPIRATION_TIME)
    await redis.set(`${EMAIL_VERIFY_TOKEN_PREFIX}:${token}`, String(userId), 'EX', EXPIRATION_TIME)
  }

  async request(email: string) {
    try {
      const user = await this.userRepository.email(email)
      if (!user) throw new NotFoundException('User not found')
      this.userCanBeVerified(user)
      const token = generateCode(10)
      await this.createVerificationToken(user.id, token)

      console.log('token', token)
      // const url = `http://localhost:5173/verify-email?tk=${token}`
      // const emailService = new EmailService()
      // send email
      return true
    } catch (err) {
      return true
    }
  }

  async verify(userId: number, token: string) {
    const user = await this.userRepository.id(userId)
    if (!user) throw new NotFoundException('User not found')
    this.userCanBeVerified(user)
    const currentUserId = await redis.get(`${EMAIL_VERIFY_TOKEN_PREFIX}:${token}`)
    if (!currentUserId) throw new ForbiddenException('Invalid user')
    if (Number(currentUserId) !== userId) throw new ForbiddenException('Invalid user')
    await redis.del(`${EMAIL_VERIFY_USER_PREFIX}:${userId}`)
    await redis.del(`${EMAIL_VERIFY_TOKEN_PREFIX}:${token}`)
    await user.merge({ verifiedAt: DateTime.now() }).save()
    return true
  }
}
