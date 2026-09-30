import { useUrlSearchParams } from '@vueuse/core'
import { z } from 'zod'
import type { District, Filters, Service } from '~/types/station'

const schema = z.object({
  service: z.union([z.string(), z.array(z.string())]).optional(),
  district: z.union([z.string(), z.array(z.string())]).optional(),
  q: z.string().optional(), sort: z.enum(['rating', 'reviews', 'price', 'name', 'distance']).optional(),
  page: z.coerce.number().int().min(1).optional(),
})
const services = new Set<Service>(['remont', 'diagnostika', 'shinomontazh', 'autoelektrika'])
const districts = new Set<District>(['center', 'frunzensky', 'partizansky', 'moskovsky', 'sovetsky', 'leninsky'])
const list = <T extends string>(value: string | string[] | undefined, allowed: Set<T>): T[] =>
  (Array.isArray(value) ? value : value ? value.split(',') : []).filter((item): item is T => allowed.has(item as T))

export function useFilters() {
  const params = useUrlSearchParams('history')
  const parsed = computed(() => schema.safeParse(params))
  const filters = computed<Filters>(() => {
    const raw = parsed.value.success ? parsed.value.data : {}
    return {
      service: list(raw.service, services), district: list(raw.district, districts), q: raw.q ?? '',
      sort: raw.sort ?? 'rating', page: raw.page ?? 1,
    }
  })
  const activeCount = computed(() => filters.value.service.length + filters.value.district.length)
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => { (params as Record<string, unknown>)[key] = Array.isArray(value) ? value.join(',') : String(value) }
  const toggle = <T extends Service | District>(key: 'service' | 'district', value: T) => {
    const current = filters.value[key] as T[]
    set(key, (current.includes(value) ? current.filter(item => item !== value) : [...current, value]) as Filters[typeof key])
    set('page', 1)
  }
  const reset = () => { Object.keys(params).forEach(key => delete (params as Record<string, unknown>)[key]) }
  return { filters, activeCount, set, toggle, reset }
}
