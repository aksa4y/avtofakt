import { spawn } from 'node:child_process'
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { request } from 'node:http'
// Fetch controls Host itself; use HTTP directly to exercise virtual-host redirects.
function requestHost(path, host, protocol) {
  return new Promise((resolve, reject) => {
    const req = request(
      origin + path,
      {
        headers: { host, 'x-forwarded-proto': protocol },
      },
      (res) => {
        res.resume()
        res.on('end', () =>
          resolve({ status: res.statusCode, location: res.headers.location }),
        )
      },
    )
    req.on('error', reject)
    req.end()
  })
}
const token = randomBytes(32).toString('hex')
const port = 3124
const server = spawn(process.execPath, ['.output/server/index.mjs'], {
  env: {
    ...process.env,
    NITRO_PORT: String(port),
    NITRO_HOST: '127.0.0.1',
    NUXT_TRUST_PROXY: 'true',
    NUXT_CONTACT_EMAIL: 'security@example.test',
    NUXT_REVIEW_ADMIN_TOKEN: token,
    NUXT_PUBLIC_SITE_URL: 'http://127.0.0.1:3124',
  },
  stdio: 'pipe',
})
let logs = ''
server.stdout.on('data', (d) => (logs += d))
server.stderr.on('data', (d) => (logs += d))
const origin = `http://127.0.0.1:${port}`
const internalLinks = new Set()
try {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(origin + '/api/health')
      if (r.ok) break
    } catch {
      /* Wait until the spawned production server is listening. */
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  for (const path of [
    '/',
    '/map',
    '/stations',
    '/minsk',
    '/brest',
    '/grodno',
    '/vitebsk',
    '/gomel',
    '/mogilev',
    '/calculator',
    '/faq',
    '/contacts',
    '/blog',
    '/privacy',
  ]) {
    const r = await fetch(origin + path)
    assert.equal(r.status, 200, path)
    const html = await r.text()
    assert.equal(
      (html.match(/<h1(?:\s|>)/g) || []).length,
      1,
      path + ' has exactly one h1',
    )
    assert.match(html, /rel="canonical"/)
    for (const match of html.matchAll(/<a\b[^>]*\bhref="(\/(?!\/)[^"]*)"/g)) {
      internalLinks.add(match[1].replaceAll('&amp;', '&').split('#')[0])
    }
    console.log('PASS', path)
  }
  const stations = await (await fetch(origin + '/api/stations')).json()
  const payload = await fetch(origin + '/stations/_payload.json', {
    headers: { 'Accept-Encoding': 'gzip' },
  })
  assert.equal(payload.status, 200)
  assert.equal(
    payload.headers.get('content-encoding'),
    'gzip',
    'compressed Nuxt payload',
  )
  assert.ok(Array.isArray(await payload.json()))
  for (const encoding of ['gzip', 'identity', 'gzip;q=0']) {
    const response = await fetch(origin + '/stations', {
      headers: { 'Accept-Encoding': encoding },
    })
    assert.equal(
      response.headers.get('content-encoding'),
      encoding === 'gzip' ? 'gzip' : null,
    )
    assert.match(await response.text(), /Каталог станций/)
    assert.match(response.headers.get('vary') || '', /Accept-Encoding/i)
  }
  for (const path of internalLinks) {
    assert.equal(
      (await fetch(origin + path)).status,
      200,
      `Internal link ${path}`,
    )
  }
  console.log(
    'PASS',
    internalLinks.size,
    'internal links against the new build',
  )
  // A size absent from prerender verifies the packaged native image processor.
  const image = await fetch(
    origin + '/_ipx/f_webp&s_640x360/images/ev-hero.webp',
  )
  assert.equal(image.status, 200, 'runtime image transformation')
  assert.match(image.headers.get('content-type'), /image\/webp/)
  assert.ok((await image.arrayBuffer()).byteLength > 1000)
  const s = stations.stations[0]
  assert.ok(s)
  for (const path of [`/stations/${s.slug}`, '/blog/kak-vybrat-razyom'])
    assert.equal((await fetch(origin + path)).status, 200, path)
  for (const path of [
    '/sitemap.xml',
    '/robots.txt',
    '/llms.txt',
    '/llms-full.txt',
    '/.well-known/security.txt',
  ]) {
    const r = await fetch(origin + path)
    assert.equal(r.status, 200, path)
    assert.ok((await r.text()).length > 40)
    console.log('PASS', path)
  }
  for (const [path, target] of [
    ['/STATIONS/', '/stations'],
    ['/index.php', '/'],
    ['/stations/', '/stations'],
    ['/security.txt', '/.well-known/security.txt'],
  ]) {
    const r = await fetch(origin + path, { redirect: 'manual' })
    assert.equal(r.status, 301, path)
    assert.equal(r.headers.get('location'), target)
  }
  for (const [host, proto] of [
    ['www.avtofakt.by', 'https'],
    ['avtofakt.by', 'http'],
  ]) {
    const r = await requestHost('/MINSk/?x=1', host, proto)
    assert.equal(r.status, 301)
    assert.equal(r.location, 'https://avtofakt.by/minsk?x=1')
  }
  const valid = await requestHost('/faq', 'avtofakt.by', 'https')
  assert.equal(valid.status, 200, 'no proxy redirect loop')
  assert.equal((await fetch(origin + '/not-a-real-page')).status, 404)
  assert.equal((await fetch(origin + '/stations/not-a-station')).status, 404)

  const reviewPath = `/api/stations/${s.slug}/reviews`
  const headers = { 'Content-Type': 'application/json', Origin: origin }
  const body = {
    name: 'Smoke test',
    rating: 4,
    text: 'Integration test review, deleted after verification.',
  }
  const rejected = await fetch(origin + reviewPath, {
    method: 'POST',
    headers: { ...headers, Origin: 'https://example.invalid' },
    body: JSON.stringify(body),
  })
  assert.equal(rejected.status, 403)
  assert.equal(
    (await fetch(origin + '/api/admin/reviews?station=' + s.slug)).status,
    401,
  )
  const submitted = await fetch(origin + reviewPath, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  assert.equal(submitted.status, 202)
  const adminHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
  const pending = await (
    await fetch(origin + '/api/admin/reviews?station=' + s.slug, {
      headers: adminHeaders,
    })
  ).json()
  const review = pending.find((r) => r.text === body.text)
  assert.ok(review && !review.approved)
  const publicBefore = await (await fetch(origin + reviewPath)).json()
  assert.ok(!publicBefore.reviews.some((r) => r.id === review.id))
  const action = async (action) =>
    fetch(origin + '/api/admin/reviews', {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify({ stationSlug: s.slug, id: review.id, action }),
    })
  assert.equal((await action('approve')).status, 200)
  const publicAfter = await (await fetch(origin + reviewPath)).json()
  assert.ok(publicAfter.reviews.some((r) => r.id === review.id))
  assert.equal((await action('delete')).status, 200)
  console.log('PASS review submission, moderation, rating and deletion')
  console.log('All HTTP, SEO and redirect smoke checks passed.')
} catch (error) {
  console.error(logs)
  throw error
} finally {
  server.kill('SIGTERM')
}
