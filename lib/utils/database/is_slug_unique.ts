import { LucidModel } from '@adonisjs/lucid/types/model'

const isSlugUnique = async (slug: string, schema: LucidModel): Promise<boolean> => {
  const sub = await schema.findBy('slug', slug)
  return !sub
}

export default isSlugUnique
