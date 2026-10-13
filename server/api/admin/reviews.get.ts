import { authorizeReviews } from '../../utils/review-auth'
import { readReviews } from '../../utils/reviews'
export default defineEventHandler(async (event) => {
  authorizeReviews(event)
  const slug = getQuery(event).station
  if (typeof slug !== 'string' || !/^osm-(node|way|relation)-\d+$/.test(slug))
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid station query required',
    })
  return readReviews(slug, true)
})
