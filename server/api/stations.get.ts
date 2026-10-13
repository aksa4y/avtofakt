import { stationData } from '../utils/stations'
export default defineEventHandler((event) => {
  setHeader(event, 'X-Robots-Tag', 'noindex')
  return stationData
})
