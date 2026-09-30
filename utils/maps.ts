export function mapsUrl(address: string): string {
  return `https://yandex.by/maps/?text=${encodeURIComponent(address)}`
}
