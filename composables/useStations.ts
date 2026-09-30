import type { Filters, Station } from '~/types/station'

interface StationResponse {
  items: Station[]
  total: number
  page: number
  pageSize: number
}

export function useStations(filters: Ref<Filters>) {
  const key = computed(() => ['stations', ...filters.value.service, ...filters.value.district, filters.value.q, filters.value.sort, filters.value.page].join(':'))
  const endpoint: string = '/api/stations'
  return useAsyncData<StationResponse>(key, () => $fetch<StationResponse>(endpoint, { query: {
    service: filters.value.service.join(','), district: filters.value.district.join(','), q: filters.value.q,
    sort: filters.value.sort, page: filters.value.page,
  } }), { watch: [key], server: true, default: () => ({ items: [], total: 0, page: 1, pageSize: 9 }) })
}
