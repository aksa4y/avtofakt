import { timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
export function authorizeReviews(event: H3Event) {
  setHeader(event, 'Cache-Control', 'no-store')
  setHeader(event, 'X-Robots-Tag', 'noindex')
  const config = useRuntimeConfig(event)
  const expected = config.persistentReviews ? config.reviewAdminToken : ''
  const given = getHeader(event, 'authorization')?.replace(/^Bearer /, '') || ''
  if (
    !expected ||
    Buffer.byteLength(given) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(given), Buffer.from(expected))
  )
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
}
