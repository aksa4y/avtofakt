import { findStation } from '../../../utils/stations'
import { readReviews } from '../../../utils/reviews'
export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  setHeader(event, 'X-Robots-Tag', 'noindex')
  const slug = getRouterParam(event, 'slug') || ''
  if (!findStation(slug))
    throw createError({ statusCode: 404, statusMessage: 'Station not found' })
  const reviews = await readReviews(slug)
  return {
    reviews: reviews.slice(0, 50),
    count: reviews.length,
    rating: reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null,
  }
})
