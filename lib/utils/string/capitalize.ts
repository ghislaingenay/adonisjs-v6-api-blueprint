export default function capitalize(val: string): string {
  if (!val) return ''
  if (val.length === 1) return val.toUpperCase()
  return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}
