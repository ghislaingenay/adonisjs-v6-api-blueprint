/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),

  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),
  MONGO_URI: Env.schema.string(),
  SUPABASE_PROJECT_URL: Env.schema.string(),
  SUPABASE_SERVICE_ROLE_KEY: Env.schema.string(),
  SUPABASE_JWT_SECRET: Env.schema.string(),

  // CLOUDINARY_CLOUD_NAME: Env.schema.string(),
  // CLOUDINARY_API_KEY: Env.schema.string(),
  // CLOUDINARY_API_SECRET: Env.schema.string(),
  // CLOUDINARY_UPLOAD_PRESET: Env.schema.string(),

  CLIENT_URL: Env.schema.string(),

  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),
})
