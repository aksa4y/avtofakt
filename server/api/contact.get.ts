export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  setHeader(event, 'X-Robots-Tag', 'noindex')
  const config = useRuntimeConfig(event)
  return {
    email: config.contactEmail || null,
    reviewsEnabled: !!config.reviewAdminToken && config.persistentReviews,
  }
})
