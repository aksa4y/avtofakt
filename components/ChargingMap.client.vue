<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { LocateFixed, Maximize2 } from 'lucide-vue-next'
import type { Station } from '~/types/station'
const props = withDefaults(
  defineProps<{
    stations: Station[]
    center?: [number, number]
    zoom?: number
  }>(),
  { center: () => [53.9023, 27.5619], zoom: 11 },
)
const el = ref<HTMLElement>()
const message = ref('')
const locating = ref(false)
let map: L.Map | undefined
let group: L.MarkerClusterGroup | undefined
let observer: ResizeObserver | undefined
let current: L.CircleMarker | undefined
const icon = L.divIcon({
  className: 'ev-marker',
  html: '<span aria-hidden="true">ϟ</span>',
  iconSize: [34, 40],
  iconAnchor: [17, 40],
})
function draw() {
  if (!map || !group) return
  group.clearLayers()
  for (const s of props.stations) {
    const box = document.createElement('div')
    const a = document.createElement('a')
    a.href = `/stations/${s.slug}`
    a.textContent = s.name
    const address = document.createElement('p')
    address.textContent = s.address
    const detail = document.createElement('p')
    detail.textContent = `${s.power ? s.power + ' кВт · ' : ''}${s.connectors.join(' / ')} · Статус неизвестен`
    box.append(a, address, detail)
    group.addLayer(
      L.marker([s.lat, s.lng], { icon, title: s.name, alt: s.name }).bindPopup(
        box,
      ),
    )
  }
}
function locate() {
  if (!navigator.geolocation) {
    message.value = 'Браузер не поддерживает геолокацию.'
    return
  }
  locating.value = true
  navigator.geolocation.getCurrentPosition(
    (p) => {
      locating.value = false
      if (!map) return
      current?.remove()
      current = L.circleMarker([p.coords.latitude, p.coords.longitude], {
        radius: 9,
        color: '#fff',
        fillColor: '#357cff',
        fillOpacity: 1,
      })
        .addTo(map)
        .bindPopup('Вы здесь')
      map.setView([p.coords.latitude, p.coords.longitude], 13)
      message.value = 'Местоположение найдено.'
    },
    () => {
      locating.value = false
      message.value =
        'Не удалось определить местоположение. Разрешите доступ в браузере или выберите город.'
    },
    { timeout: 12000, maximumAge: 60000 },
  )
}
onMounted(() => {
  if (!el.value) return
  map = L.map(el.value, { scrollWheelZoom: false }).setView(
    props.center,
    props.zoom,
  )
  const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)
  tiles.on('tileerror', () => {
    message.value =
      'Подложка карты временно недоступна. Список станций доступен ниже.'
  })
  group = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 45,
    chunkedLoading: true,
    chunkInterval: 40,
    chunkDelay: 20,
  })
  map.addLayer(group)
  draw()
  observer = new ResizeObserver(() => map?.invalidateSize())
  observer.observe(el.value)
})
const scheduleDraw = useDebounceFn(draw, 160)
watch(() => props.stations, scheduleDraw)
watch(
  () => props.center,
  (c) => map?.setView(c, props.zoom),
)
onBeforeUnmount(() => {
  observer?.disconnect()
  map?.remove()
  map = undefined
})
</script>
<template>
  <div class="map-shell">
    <div
      ref="el"
      class="leaflet-canvas"
      role="region"
      aria-label="Интерактивная карта зарядных станций"
    />
    <div class="map-tools">
      <button class="map-tool" :disabled="locating" @click="locate">
        <LocateFixed :size="17" />{{
          locating ? 'Определяем…' : 'Моё местоположение'
        }}</button
      ><button
        class="map-tool"
        aria-label="Вернуть карту к выбранному городу"
        @click="map?.setView(center, zoom)"
      >
        <Maximize2 :size="17" />
      </button>
    </div>
    <p v-if="message" class="map-message" role="status">{{ message }}</p>
    <div class="map-legend">
      <span class="legend-dot" /> Зарядная станция <span>·</span>
      {{ stations.length }} на карте
    </div>
  </div>
</template>
