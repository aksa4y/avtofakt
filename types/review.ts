export interface Review {
  id: string
  stationSlug: string
  name: string
  rating: number
  text: string
  createdAt: string
  approved: boolean
}
export interface ReviewsResponse {
  reviews: Review[]
  count: number
  rating: number | null
}
