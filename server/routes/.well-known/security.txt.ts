export default defineEventHandler((event) => {
  const email = useRuntimeConfig(event).contactEmail
  if (!email)
    throw createError({
      statusCode: 503,
      statusMessage: 'Security contact not configured',
    })
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  const expires = new Date(Date.now() + 180 * 86400000).toISOString()
  return `Contact: mailto:${email}\nExpires: ${expires}\nPreferred-Languages: ru, en\nCanonical: https://avtofakt.by/.well-known/security.txt\n`
})
