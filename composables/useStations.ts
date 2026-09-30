import type { Filters, Station } from '~/types/station'

export function useStations(filters: Ref<Filters>) {
  const key = computed(() => ['stations', ...filters.value.service, ...filters.value.district, filters.value.q, filters.value.sort, filters.value.page].join(':'))
  return useAsyncData<{ items: Station[]; total: number; page: number; pageSize: number }>(key, () => $fetch('/api/stations', { query: {
    service: filters.value.service.join(','), district: filters.value.district.join(','), q: filters.value.q,
    sort: filters.value.sort, page: filters.value.page,
  } }), { watch: [key], server: true, default: () => ({ items: [], total: 0, page: 1, pageSize: 9 }) })
}
