import { PaymentStatus } from '#types'

export const PAYMENT_STATUS = [
  PaymentStatus.Paid,
  PaymentStatus.Pending,
  PaymentStatus.Refunded,
  PaymentStatus.Cancelled,
  PaymentStatus.Failed,
]
