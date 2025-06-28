export default function binaryToHex16(binaryHash: string) {
  // Convert binary to an integer
  let hex = BigInt('0b' + binaryHash).toString(16)

  // Ensure it is 16 characters (pad with leading zeros if necessary)
  return hex.padStart(16, '0').slice(0, 16)
}
