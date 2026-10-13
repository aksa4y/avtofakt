import type { Review } from '../../types/review'
export async function readReviews(stationSlug: string, includePending = false) {
  if (!useRuntimeConfig().persistentReviews) return []
  const storage = useStorage('reviews')
  const keys = await storage.getKeys(stationSlug)
  const items = await Promise.all(
    keys.map((key) => storage.getItem<Review>(key)),
  )
  return items
    .filter(
      (r): r is Review =>
        !!r && r.stationSlug === stationSlug && (includePending || r.approved),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
