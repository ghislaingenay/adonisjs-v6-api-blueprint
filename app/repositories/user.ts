import InternalServerException from '#exceptions/internal_server_error_exception'
import NotFoundException from '#exceptions/not_found_exception'
import User from '#models/user'
import { GetUserList, WithTransaction } from '#types'
import db from '@adonisjs/lucid/services/db'

export default class UserRepository {
  async list(params: GetUserList): Promise<User[]> {
    const whereConditions: string[] = []
    if (params.id) whereConditions.push(`"id" = :id`)
    // if (params.role) whereConditions.push(`"role" = :role`)
    if (params.email) whereConditions.push(`"email" = :email`)
    if (params.mobile) whereConditions.push(`"mobile" = :mobile`)
    if (Number.isNaN(Number(params.isVerified)))
      params.isVerified
        ? whereConditions.push(`"verified_at" is not null`)
        : whereConditions.push(`"verified_at" is null`)
    const where = whereConditions.join(' AND ')
    try {
      const users = await User.query().whereRaw(where, params).exec()
      return users
    } catch (err) {
      throw new InternalServerException('Cannot get users')
    }
  }

  /**
   * Fetch User by id
   * @param {number} id userId
   * @async  Await User db call
   * @returns {Promise<User>} User
   * @throws {NotFoundException} User not found
   * @throws {InternalServerException} Internal Server Error - Db issues
   */
  async id(id: number): Promise<User> {
    try {
      const user = await User.findBy('id', id)
      if (!user) throw new NotFoundException('User not found')
      return user
    } catch (err) {
      throw new InternalServerException('User: retrieval error')
    }
  }

  async externalId(externalId: string): Promise<User> {
    try {
      const user = await User.findBy('external_customer_id', externalId)
      if (!user) throw new NotFoundException('User not found')
      return user
    } catch (err) {
      throw new InternalServerException('User: retrieval error')
    }
  }

  async email(email: string): Promise<User> {
    try {
      const user = await User.findBy('email', email)
      if (!user) throw new NotFoundException('User not found')
      return user
    } catch (err) {
      throw new InternalServerException('User: retrieval error')
    }
  }

  async dactivate(id: number): Promise<boolean> {
    try {
      await User.query().update({ isActive: 'FALSE' }).where('id', id)
      return true
    } catch (err) {
      throw new InternalServerException('User: deactivation error')
    }
  }

  async verify(id: number): Promise<boolean> {
    try {
      await User.query().update({ isVerified: true }).where('id', id)
      return true
    } catch (err) {
      throw new InternalServerException('User: verification error')
    }
  }

  // check that the userId already exists and the id matches the userId should not be included here
  async update(id: number, body: Partial<User>): Promise<WithTransaction<User>> {
    try {
      const trx = await db.transaction()
      delete body.password
      const [data] = await User.query({ client: trx }).update(body).where('id', id).exec()
      return { data, trx }
    } catch (err) {
      throw new InternalServerException('User: update error')
    }
  }

  async create(body: Partial<User>): Promise<WithTransaction<User>> {
    try {
      const trx = await db.transaction()

      const user = await User.create(body, { client: trx })
      return { data: user, trx }
    } catch (err) {
      console.error('Error creating user:', err)
      throw new InternalServerException('User: create error')
    }
  }

  async updatePassword(id: number, password: string): Promise<WithTransaction<unknown>> {
    try {
      const trx = await db.transaction()
      const data = await User.query({ client: trx }).update({ password }).where('id', id).exec()
      return { data, trx }
    } catch (err) {
      throw new InternalServerException('User: update error')
    }
  }
}
