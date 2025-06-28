export default function cloneObject<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}
