import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { randomBytes } from 'node:crypto'

const root = '.vercel/output'
const config = JSON.parse(await readFile(`${root}/config.json`, 'utf8'))
assert.equal(config.version, 3)
assert.ok(config.routes.some((route) => route.dest?.includes('__fallback')))
await access(`${root}/static/index.html`)
const home = await readFile(`${root}/static/index.html`, 'utf8')
assert.match(home, /\/_vercel\/image\?/, 'Vercel image optimization provider')
assert.ok(config.images?.sizes?.length, 'Vercel image sizes are configured')
const ogPath = home.match(
  /property="og:image" content="https?:\/\/[^/]+([^"?]+)/,
)?.[1]
assert.ok(ogPath, 'generated homepage OG image URL')
await access(`${root}/static${ogPath}`)
await access(`${root}/static/minsk/index.html`)
const functionRoot = `${root}/functions/__fallback.func`
const functionConfig = JSON.parse(
  await readFile(`${functionRoot}/.vc-config.json`, 'utf8'),
)
assert.match(functionConfig.runtime, /^nodejs/)
process.env.NUXT_REVIEW_ADMIN_TOKEN = randomBytes(32).toString('hex')
const { default: handler } = await import(
  pathToFileURL(resolve(functionRoot, functionConfig.handler)).href
)
const server = createServer(handler)
server.listen(0, '127.0.0.1')
await once(server, 'listening')
const origin = `http://127.0.0.1:${server.address().port}`
try {
  for (const path of [
    '/api/health',
    '/map',
    '/stations',
    '/calculator',
    '/faq',
    '/blog',
    '/sitemap.xml',
    '/robots.txt',
    '/llms.txt',
  ]) {
    const response = await fetch(origin + path)
    assert.equal(response.status, 200, path)
    await response.arrayBuffer()
  }
  const { stations } = await (await fetch(origin + '/api/stations')).json()
  const slug = stations[0].slug
  assert.equal((await fetch(origin + `/stations/${slug}`)).status, 200)
  const contact = await (await fetch(origin + '/api/contact')).json()
  assert.equal(
    contact.reviewsEnabled,
    false,
    'serverless must not accept non-persistent reviews',
  )
  const reviews = await (
    await fetch(origin + `/api/stations/${slug}/reviews`)
  ).json()
  assert.deepEqual(reviews.reviews, [])
  assert.equal(
    (await fetch(origin + `/api/stations/${slug}/reviews`, { method: 'POST' }))
      .status,
    503,
  )
  assert.equal((await fetch(origin + '/missing-page')).status, 404)
  console.log(
    'PASS Vercel Build Output v3, static pages, SSR function, API, SEO and review storage guard',
  )
} finally {
  server.closeAllConnections()
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  )
}
