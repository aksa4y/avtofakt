export const connectors = ['Type 2', 'CCS', 'CHAdeMO', 'GB/T'] as const
export type Connector = (typeof connectors)[number]
export interface Station {
  id: string
  slug: string
  name: string
  operator: string
  city: string
  address: string
  lat: number
  lng: number
  connectors: Connector[]
  power: number | null
  hours: string | null
  payment: 'paid' | 'free' | 'unknown'
  status: 'available' | 'busy' | 'offline' | 'unknown'
  price: number | null
  source: string
  updatedAt: string
  photo: string | null
}
export interface StationFilters {
  q: string
  city: string
  connector: string
  minPower: number
  payment: string
  status: string
}
export interface StationResponse {
  stations: Station[]
  updatedAt: string
  source: string
}
