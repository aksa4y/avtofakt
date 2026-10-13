import test from 'node:test'
import assert from 'node:assert/strict'
import { calculate } from '../utils/calculator'
import { normalizedPagePath } from '../utils/redirect'
import { filterStations } from '../utils/stations'
import type { StationResponse } from '../types/station'
import snapshot from '../shared/stations.json'
const input = {
  battery: 60,
  from: 20,
  to: 80,
  tariff: 0.65,
  loss: 10,
  consumption: 18,
  petrolConsumption: 8,
  petrolPrice: 2.6,
}
test('energy accounting includes losses, cost and comparison', () => {
  const r = calculate(input)!
  assert.equal(r.energy, 40)
  assert.equal(r.cost, 26)
  assert.equal(r.electric100, 13)
  assert.equal(r.petrol100, 20.8)
})
test('invalid ranges and non-finite input rejected', () => {
  for (const v of [
    { from: 90, to: 20 },
    { loss: 100 },
    { tariff: -1 },
    { battery: NaN },
    { consumption: 0 },
  ])
    assert.equal(calculate({ ...input, ...v }), null)
})
test('page redirects preserve case-sensitive assets and system routes', () => {
  assert.equal(normalizedPagePath('/STATIONS/'), '/stations')
  assert.equal(normalizedPagePath('/INDEX.PHP'), '/')
  for (const path of [
    '/images/MyCar.webp',
    '/_ipx/f_webp/MyCar.webp',
    '/api/SomeEndpoint',
  ])
    assert.equal(normalizedPagePath(path), path)
})
test('station snapshot has unique identities, source and coordinates', () => {
  const d = snapshot as StationResponse
  assert.ok(d.stations.length > 10)
  assert.equal(new Set(d.stations.map((s) => s.slug)).size, d.stations.length)
  for (const s of d.stations) {
    assert.ok(s.lat > 51 && s.lat < 57)
    assert.ok(s.lng > 23 && s.lng < 33)
    assert.match(
      s.source,
      /^https:\/\/www.openstreetmap.org\/(node|way|relation)\/\d+$/,
    )
    assert.equal(s.status, 'unknown')
    assert.equal(s.price, null)
  }
})
test('combined filters do not treat unknown power as matching', () => {
  const d = snapshot as StationResponse
  const f = {
    q: '',
    city: 'minsk',
    connector: 'CCS',
    minPower: 50,
    payment: '',
    status: '',
  }
  const result = filterStations(d.stations, f)
  assert.ok(result.length > 0)
  assert.ok(
    result.every(
      (s) =>
        s.city === 'minsk' &&
        s.connectors.includes('CCS') &&
        s.power !== null &&
        s.power >= 50,
    ),
  )
})
