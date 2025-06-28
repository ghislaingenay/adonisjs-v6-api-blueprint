import { WithTransaction } from '#types'

export default async function autoCommit<T>(fn: Promise<WithTransaction<T>>) {
  return await fn.then(({ trx, data }: WithTransaction<T>) => {
    trx.commit()
    return data as T
  })
}
