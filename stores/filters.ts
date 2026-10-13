import { defineStore } from 'pinia'
import type { StationFilters } from '~/types/station'
export const useFiltersStore = defineStore('filters', {
  state: (): StationFilters => ({
    q: '',
    city: '',
    connector: '',
    minPower: 0,
    payment: '',
    status: '',
  }),
})
