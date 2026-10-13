import { readLimitedJson } from '../../utils/body'
import { z } from 'zod'
import { authorizeReviews } from '../../utils/review-auth'
import type { Review } from '../../../types/review'
const schema = z.object({
  stationSlug: z.string().regex(/^osm-(node|way|relation)-\d+$/),
  id: z.uuid(),
  action: z.enum(['approve', 'delete']),
})
export default defineEventHandler(async (event) => {
  authorizeReviews(event)
  const body = schema.safeParse(await readLimitedJson(event, 1024))
  if (!body.success)
    throw createError({ statusCode: 400, statusMessage: 'Invalid request' })
  const storage = useStorage('reviews')
  const key = `${body.data.stationSlug}:${body.data.id}`
  const review = await storage.getItem<Review>(key)
  if (!review)
    throw createError({ statusCode: 404, statusMessage: 'Review not found' })
  if (body.data.action === 'delete') await storage.removeItem(key)
  else await storage.setItem(key, { ...review, approved: true })
  return { ok: true }
})
