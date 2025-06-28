/** Match text between two strings
 * @param {string} text - The text to match
 * @param {string} q - The query to match
 * @description Case sensitive
 * @returns {boolean} - True if the text match the query
 * */
const matchText = (text: string, q: string) => {
  if (!text) return false
  if (q.length === 0) return true // no text so could be valid
  if (q.length > text.length) return false // query should be less than text or same
  for (const [i, char] of q.split('').entries()) {
    if (char !== text[i]) return false
  }
  return true
}

export default matchText
