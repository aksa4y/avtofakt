import snapshot from '../../shared/stations.json'
import type { StationResponse } from '../../types/station'
export const stationData = snapshot as StationResponse
export function findStation(slug: string) {
  return stationData.stations.find((s) => s.slug === slug)
}
