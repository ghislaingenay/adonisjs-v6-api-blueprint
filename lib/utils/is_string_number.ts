export default function isStringNumber(value: string): boolean {
  return !Number.isNaN(Number(value))
}
