/* eslint-disable @typescript-eslint/naming-convention */
import { HTTP_STATUS } from '#types'

export type Attachment = {
  /** Content of an attached file. */
  content?: string | Buffer
  /** Name of attached file. */
  filename?: string | false | undefined
  /** Path where the attachment file is hosted */
  path?: string
}

export interface SendEmailBaseOptions {
  from: string // 'Acme <onboarding@resend.dev>'
  to: string | string[]
  subject: string
  html: string
  attachments?: Attachment[]
  cc?: string | string[]
  /**
   * Custom headers to add to the email.
   *
   * @link https://resend.com/docs/api-reference/emails/send-email#body-parameters
   */
  headers?: Record<string, string>
  reply_to?: string | string[]
}

export interface ResendErrorBody {
  statusCode: number
  message: string
  name: string
}

/** Same as RESEND_ERROR_CODE_KEY  */
export type RESEND_ERROR_CODE =
  | 'missing_required_field'
  | 'invalid_access'
  | 'invalid_parameter'
  | 'invalid_region'
  | 'missing_api_key'
  | 'invalid_api_key'
  | 'invalid_attachment'
  | 'validation_error'
  | 'rate_limit_exceeded'
  | 'invalid_from_address'
  | 'invalid_to_address'
  | 'not_found'
  | 'method_not_allowed'
  | 'invalid_scope'
  | 'daily_quota_exceeded'
  | 'application_error'
  | 'internal_server_error'

export type ResendErrorRecord = Record<
  RESEND_ERROR_CODE,
  {
    code: string
    /** HTTP Status provided by resend
     *
     * @link https://resend.com/docs/api-reference/emails/send-email#response-parameters
     */
    apiStatus: HTTP_STATUS
    /** Status shown to the user for HTTP Request */
    status: HTTP_STATUS
  }
>
