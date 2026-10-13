import { readLimitedJson } from '../../../utils/body'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { findStation } from '../../../utils/stations'
import { readReviews } from '../../../utils/reviews'
import type { Review } from '../../../../types/review'
const schema = z
  .object({
    name: z.string().trim().min(2).max(60),
    rating: z.number().int().min(1).max(5),
    text: z.string().trim().min(20).max(2000),
    website: z.string().max(0).optional(),
  })
  .strict()
const attempts = new Map<string, { count: number; until: number }>()
export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  setHeader(event, 'X-Robots-Tag', 'noindex')
  const config = useRuntimeConfig(event)
  if (!config.reviewAdminToken)
    throw createError({
      statusCode: 503,
      statusMessage: 'Review moderation is not configured',
    })
  const origin = getHeader(event, 'origin')
  if (!origin || origin !== config.public.siteUrl)
    throw createError({ statusCode: 403, statusMessage: 'Invalid origin' })
  const slug = getRouterParam(event, 'slug') || ''
  if (!findStation(slug))
    throw createError({ statusCode: 404, statusMessage: 'Station not found' })
  const now = Date.now()
  for (const [key, value] of attempts)
    if (value.until < now) attempts.delete(key)
  const ip =
    getRequestIP(event, { xForwardedFor: !!config.trustProxy }) || 'unknown'
  const entry = attempts.get(ip) || { count: 0, until: now + 3600000 }
  if (entry.count >= 3 || attempts.size >= 10000)
    throw createError({
      statusCode: 429,
      statusMessage: 'Please try again later',
    })
  entry.count++
  attempts.set(ip, entry)

  const body = schema.safeParse(await readLimitedJson(event, 8192))
  if (!body.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'Check name, rating and review text (20-2000 characters)',
    })
  if ((await readReviews(slug, true)).length >= 1000)
    throw createError({
      statusCode: 429,
      statusMessage: 'Station review limit reached',
    })
  const review: Review = {
    id: randomUUID(),
    stationSlug: slug,
    name: body.data.name,
    rating: body.data.rating,
    text: body.data.text,
    createdAt: new Date().toISOString(),
    approved: false,
  }
  await useStorage('reviews').setItem(`${slug}:${review.id}`, review)
  setResponseStatus(event, 202)
  return {
    message:
      'Отзыв отправлен на модерацию. Он появится после проверки редакцией.',
  }
})
