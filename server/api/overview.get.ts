import { stationData } from '../utils/stations'
import { cities } from '../../shared/cities'
export default defineEventHandler((event) => {
  setHeader(event, 'X-Robots-Tag', 'noindex')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return {
    total: stationData.stations.length,
    byCity: Object.fromEntries(
      cities.map((c) => [
        c.slug,
        stationData.stations.filter((s) => s.city === c.slug).length,
      ]),
    ),
    featured: stationData.stations
      .filter((s) => s.city === 'minsk' && s.connectors.length > 0)
      .slice(0, 3),
  }
})
