import { writeFile, readFile } from 'node:fs/promises'
import { cities } from '../shared/cities'
import type { Station, Connector } from '../types/station'
interface Element {
  type: string
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}
// A local file must already be scoped to Belarus; the network query scopes by its national relation.
const local = process.argv[2]
const query =
  '[out:json][timeout:90];area["ISO3166-1"="BY"][admin_level=2]->.a;nwr[amenity=charging_station](area.a);out center tags;'
const response = local
  ? (JSON.parse(await readFile(local, 'utf8')) as { elements: Element[] })
  : await (async () => {
      const r = await fetch(
        `https://overpass-api.de/api/interpreter?${new URLSearchParams({ data: query })}`,
        {
          signal: AbortSignal.timeout(110000),
          headers: { 'User-Agent': 'Avtofakt/1.0 (https://avtofakt.by)' },
        },
      )
      if (!r.ok) throw new Error(`Overpass: ${r.status}`)
      return (await r.json()) as { elements: Element[] }
    })()
const updatedAt = new Date().toISOString()
function distance(a: number, b: number, c: number, d: number) {
  const rad = Math.PI / 180
  const x =
    Math.sin(((c - a) * rad) / 2) ** 2 +
    Math.cos(a * rad) * Math.cos(c * rad) * Math.sin(((d - b) * rad) / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}
const mapping: Record<string, Connector> = {
  type2: 'Type 2',
  type2_cable: 'Type 2',
  type2_combo: 'CCS',
  chademo: 'CHAdeMO',
  gbt_dc: 'GB/T',
  gbt_ac: 'GB/T',
  gb_t_dc: 'GB/T',
  gb_t_ac: 'GB/T',
}
const stations: Station[] = response.elements
  .flatMap((e): Station[] => {
    const t = e.tags || {}
    const lat = e.lat ?? e.center?.lat
    const lng = e.lon ?? e.center?.lon
    if (
      lat === undefined ||
      lng === undefined ||
      t.access === 'private' ||
      t.access === 'no'
    )
      return []
    const nearest = [...cities].sort(
      (a, b) =>
        distance(lat, lng, a.lat, a.lng) - distance(lat, lng, b.lat, b.lng),
    )[0]!
    const city =
      distance(lat, lng, nearest.lat, nearest.lng) < 25 ? nearest.slug : 'other'
    const connectors = [
      ...new Set(
        Object.entries(mapping)
          .filter(
            ([key]) =>
              t[`socket:${key}`] &&
              t[`socket:${key}`] !== '0' &&
              t[`socket:${key}`] !== 'no',
          )
          .map(([, value]) => value),
      ),
    ]
    const powers = Object.entries(t)
      .filter(
        ([key]) =>
          /^socket:.+:output$/.test(key) || key === 'charging_station:output',
      )
      .flatMap(([, value]) =>
        value.split(';').map((v) => {
          const n = parseFloat(v.replace(',', '.'))
          return /kW/i.test(v) ? n : /W$/i.test(v) ? n / 1000 : NaN
        }),
      )
      .filter((n) => Number.isFinite(n) && n > 0 && n <= 1500)
    const street = t['addr:street:ru'] || t['addr:street']
    const house = t['addr:housenumber']
    const address = [
      t['addr:city:ru'] ||
        t['addr:city'] ||
        (city !== 'other' ? nearest.name : ''),
      street,
      house,
    ]
      .filter(Boolean)
      .join(', ')
    const operator = t.brand || t.operator || 'Оператор не указан'
    return [
      {
        id: `${e.type}-${e.id}`,
        slug: `osm-${e.type}-${e.id}`,
        name:
          t['name:ru'] ||
          t.name ||
          (operator !== 'Оператор не указан'
            ? `${operator}${t.ref ? ' · ' + t.ref : ''}`
            : 'Зарядная станция'),
        operator,
        city,
        address: address || `Координаты: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        lat,
        lng,
        connectors,
        power: powers.length ? Math.max(...powers) : null,
        hours: t.opening_hours || null,
        payment: t.fee === 'yes' ? 'paid' : t.fee === 'no' ? 'free' : 'unknown',
        status: 'unknown',
        price: null,
        source: `https://www.openstreetmap.org/${e.type}/${e.id}`,
        updatedAt,
        photo: null,
      },
    ]
  })
  .sort(
    (a, b) =>
      (a.city === 'minsk' ? 0 : 1) - (b.city === 'minsk' ? 0 : 1) ||
      (b.power || 0) - (a.power || 0) ||
      a.id.localeCompare(b.id),
  )
if (stations.length < 10)
  throw new Error('Suspiciously small response; previous snapshot preserved')
await writeFile(
  new URL('../shared/stations.json', import.meta.url),
  JSON.stringify(
    { stations, updatedAt, source: '© OpenStreetMap contributors, ODbL 1.0' },
    null,
    2,
  ) + '\n',
)
console.log(
  `Imported ${stations.length} public charging locations in Belarus. Minsk metro (25 km radius): ${stations.filter((s) => s.city === 'minsk').length}.`,
)
