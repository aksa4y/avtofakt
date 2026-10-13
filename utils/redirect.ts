/** Normalize page paths only: assets, generated image routes and APIs are case-sensitive. */
export function normalizedPagePath(path: string) {
  if (
    path.startsWith('/api/') ||
    path.startsWith('/_') ||
    path.startsWith('/images/') ||
    path.startsWith('/fonts/') ||
    path.startsWith('/.well-known/') ||
    (/\.[a-z0-9]+$/i.test(path) && !/^\/index\.php\/?$/i.test(path))
  )
    return path
  if (/^\/index\.php\/?$/i.test(path)) return '/'
  return path.toLowerCase().replace(/\/+$/, '') || '/'
}
