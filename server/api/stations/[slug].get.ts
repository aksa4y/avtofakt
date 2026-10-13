import { findStation } from '../../utils/stations'
export default defineEventHandler((event) => {
  setHeader(event, 'X-Robots-Tag', 'noindex')
  const station = findStation(getRouterParam(event, 'slug') || '')
  if (!station)
    throw createError({ statusCode: 404, statusMessage: 'Station not found' })
  return station
})
