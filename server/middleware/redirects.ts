import { normalizedPagePath } from '../../utils/redirect'
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const url = getRequestURL(event)
  const host = getRequestHost(event).split(':')[0]?.toLowerCase()
  const productionHost = host === 'avtofakt.by' || host === 'www.avtofakt.by'
  const path = normalizedPagePath(url.pathname)
  const protocol = config.trustProxy
    ? getHeader(event, 'x-forwarded-proto')?.split(',')[0]?.trim() ||
      url.protocol.replace(':', '')
    : url.protocol.replace(':', '')
  const normalizeOrigin =
    productionHost && (host === 'www.avtofakt.by' || protocol !== 'https')
  if (normalizeOrigin || path !== url.pathname) {
    // Fixed origin prevents Host-header based open redirects; local development keeps relative paths.
    return sendRedirect(
      event,
      `${productionHost ? 'https://avtofakt.by' : ''}${path}${url.search}`,
      301,
    )
  }
})
