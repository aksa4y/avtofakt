import type { Station, StationFilters } from '../types/station'
export function filterStations(stations: Station[], f: StationFilters) {
  const q = f.q.trim().toLocaleLowerCase('ru')
  return stations.filter(
    (s) =>
      (!q ||
        `${s.name} ${s.address} ${s.operator}`
          .toLocaleLowerCase('ru')
          .includes(q)) &&
      (!f.city || s.city === f.city) &&
      (!f.connector || s.connectors.some((c) => c === f.connector)) &&
      (!f.minPower || (s.power !== null && s.power >= f.minPower)) &&
      (!f.payment || s.payment === f.payment) &&
      (!f.status || s.status === f.status),
  )
}
export const stationPower = (s: Station) =>
  s.power === null ? 'Мощность не указана' : `${s.power} кВт`
export const paymentLabel = (s: Station) =>
  s.payment === 'free'
    ? 'Бесплатно по данным OSM'
    : s.payment === 'paid'
      ? 'Платная зарядка'
      : 'Тариф уточняется'
