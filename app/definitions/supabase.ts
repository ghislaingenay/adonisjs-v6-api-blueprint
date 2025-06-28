import env from '#start/env'
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const connector = createClient(
  env.get('SUPABASE_PROJECT_URL'),
  env.get('SUPABASE_SERVICE_ROLE_KEY')
)

export { connector }
