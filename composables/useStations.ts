import type { StationResponse } from '~/types/station'
export function useStations() {
  return useAsyncData<StationResponse>('stations', () =>
    $fetch<StationResponse>('/api/stations'),
  )
}
