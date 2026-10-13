import { stationData } from '../../utils/stations'
import { cities } from '../../../shared/cities'
import { articles } from '../../../shared/content'
export default defineSitemapEventHandler(() => [
  ...[
    '/',
    '/map',
    '/stations',
    '/calculator',
    '/faq',
    '/contacts',
    '/privacy',
    '/blog',
  ].map((loc) => ({ loc })),
  ...cities.map((c) => ({ loc: `/${c.slug}` })),
  ...stationData.stations.map((s) => ({
    loc: `/stations/${s.slug}`,
    lastmod: s.updatedAt,
  })),
  ...articles.map((a) => ({ loc: `/blog/${a.slug}`, lastmod: a.date })),
  ...Array.from(
    { length: Math.max(0, Math.ceil(stationData.stations.length / 18) - 1) },
    (_, i) => ({ loc: `/stations?page=${i + 2}` }),
  ),
])
