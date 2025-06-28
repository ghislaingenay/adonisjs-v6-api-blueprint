// import vine from '@vinejs/vine'

// export const getEmailTemplateImagesValidator = vine.compile(
//   vine.object({
//     page: vine.string().regex(/^\d+$/).transform(Number),
//     results: vine.string().regex(/^\d+$/).transform(Number),
//     template: vine
//       .string()
//       .optional()
//       .transform((v) => {
//         if (!Number.isNaN(Number(v))) return Number(v)
//         else return undefined
//       }),
//     image: vine.string().optional(),
//     project: vine
//       .string()
//       .optional()
//       .transform((v) => {
//         if (!Number.isNaN(Number(v))) return Number(v)
//         else return undefined
//       }),
//   })
// )
