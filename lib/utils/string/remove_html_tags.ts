export default function removeHtmlTags(input: string) {
  return input.replace(/<[^>]*>/g, '')
}
