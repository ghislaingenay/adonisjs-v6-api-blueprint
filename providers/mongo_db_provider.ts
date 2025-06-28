import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import type { ApplicationService } from '@adonisjs/core/types'
import mongoose from 'mongoose'

export default class MongoDbProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  async register() {
    const mongoUrl = env.get('MONGO_URI')
    await mongoose.connect(mongoUrl)
    // logger.info('Connected to MongoDB')
    this.app.container.singleton('mongoose' as any, () => mongoose)
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    logger.error('Disconnected from MongoDB')
    await mongoose.disconnect()
  }
}
