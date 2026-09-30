import { z } from 'zod'
import { stations } from '../utils/stations'
import type { District, Service, Station } from '~/types/station'
import { distanceKm } from '~/utils/distance'

const querySchema = z.object({
  service: z.string().optional().default(''), district: z.string().optional().default(''), q: z.string().optional().default(''),
  sort: z.enum(['rating','reviews','price','name','distance']).optional().default('rating'),
  page: z.coerce.number().int().min(1).optional().default(1), lat: z.coerce.number().optional(), lng: z.coerce.number().optional(),
})
const parseList = <T extends string>(value: string, allowed: readonly T[]) => value.split(',').filter((v): v is T => allowed.includes(v as T))
const allServices: Service[] = ['remont','diagnostika','shinomontazh','autoelektrika']
const allDistricts: District[] = ['center','frunzensky','partizansky','moskovsky','sovetsky','leninsky']

export default defineEventHandler((event) => {
  const parsed = querySchema.safeParse(getQuery(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Некорректные фильтры каталога' })
  const query = parsed.data
  const selectedServices = parseList(query.service, allServices)
  const selectedDistricts = parseList(query.district, allDistricts)
  let result = stations.filter((station) =>
    (!selectedServices.length || selectedServices.every(service => station.services.includes(service))) &&
    (!selectedDistricts.length || selectedDistricts.includes(station.district)) &&
    (!query.q || station.name.toLocaleLowerCase('ru').includes(query.q.toLocaleLowerCase('ru'))),
  )
  const byName = (a: Station, b: Station) => a.name.localeCompare(b.name, 'ru')
  if (query.sort === 'rating') result.sort((a,b) => b.rating-a.rating || b.reviewCount-a.reviewCount)
  if (query.sort === 'reviews') result.sort((a,b) => b.reviewCount-a.reviewCount)
  if (query.sort === 'price') result.sort((a,b) => a.price-b.price || byName(a,b))
  if (query.sort === 'name') result.sort(byName)
  if (query.sort === 'distance' && query.lat !== undefined && query.lng !== undefined) result.sort((a,b) => distanceKm(query.lat!,query.lng!,a.latitude,a.longitude)-distanceKm(query.lat!,query.lng!,b.latitude,b.longitude))
  const pageSize = 9
  const total = result.length
  return { items: result.slice((query.page-1)*pageSize, query.page*pageSize), total, page: query.page, pageSize }
})
