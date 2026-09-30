export type Service = 'remont' | 'diagnostika' | 'shinomontazh' | 'autoelektrika'
export type District = 'center' | 'frunzensky' | 'partizansky' | 'moskovsky' | 'sovetsky' | 'leninsky'
export type PriceLevel = 1 | 2 | 3

export interface Station {
  id: string
  name: string
  shortName: string
  services: Service[]
  district: District
  address: string
  phone: string
  hours: { open: string; close: string; days: number[] }
  rating: number
  reviewCount: number
  price: PriceLevel
  latitude: number
  longitude: number
  verified: boolean
}

export interface Filters {
  service: Service[]
  district: District[]
  q: string
  sort: 'rating' | 'reviews' | 'price' | 'name' | 'distance'
  page: number
  lat?: number
  lng?: number
}

export const SERVICE_LABELS: Record<Service, string> = {
  remont: 'Ремонт', diagnostika: 'Диагностика', shinomontazh: 'Шиномонтаж', autoelektrika: 'Автоэлектрика',
}
export const DISTRICT_LABELS: Record<District, string> = {
  center: 'Центральный', frunzensky: 'Фрунзенский', partizansky: 'Партизанский',
  moskovsky: 'Московский', sovetsky: 'Советский', leninsky: 'Ленинский',
}
