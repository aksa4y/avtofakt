<script setup lang="ts">
import {
  ArrowUpRight,
  MapPin,
  Zap,
  Clock,
  Plug,
  ExternalLink,
} from 'lucide-vue-next'
import type { Station } from '~/types/station'
import { cities } from '~/shared/cities'
import { stationPower, paymentLabel } from '~/utils/stations'
const route = useRoute()
const { data: station, error } = await useAsyncData(
  `station-${route.params.slug}`,
  () =>
    $fetch<Station>(
      `/api/stations/${encodeURIComponent(String(route.params.slug))}`,
    ),
)
if (error.value || !station.value)
  throw createError({ statusCode: 404, statusMessage: 'Станция не найдена' })
const s = station.value
const city = cities.find((c) => c.slug === s.city)
usePageSeo(
  `${s.name} — зарядная станция${city ? ` в ${city.locative}` : ' в Беларуси'}`,
  `${s.address}. ${stationPower(s)}. ${s.connectors.join(', ')}. Адрес, график и карта проезда к зарядной станции.`.slice(
    0,
    160,
  ),
)
useSchemaOrg([
  {
    '@type': 'LocalBusiness',
    '@id': `${useRuntimeConfig().public.siteUrl}/stations/${s.slug}#station`,
    name: s.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.address,
      addressLocality: city?.name,
      addressCountry: 'BY',
    },
    geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng },
    url: `${useRuntimeConfig().public.siteUrl}/stations/${s.slug}`,
    sameAs: [s.source],
    ...(s.hours === '24/7' ? { openingHours: 'Mo-Su 00:00-23:59' } : {}),
  },
])
</script>
<template>
  <div class="container page">
    <Breadcrumbs
      :items="[{ label: 'Станции', to: '/stations' }, { label: s.name }]"
    />
    <div class="station-detail-heading">
      <div>
        <span class="eyebrow"
          >{{ s.operator }} / {{ city?.name || 'БЕЛАРУСЬ' }}</span
        >
        <h1>{{ s.name }}</h1>
        <p><MapPin :size="17" /> {{ s.address }}</p>
      </div>
      <a
        class="button button-primary"
        :href="`https://www.openstreetmap.org/directions?to=${s.lat},${s.lng}`"
        target="_blank"
        rel="noopener noreferrer"
        >Построить маршрут <ArrowUpRight :size="18"
      /></a>
    </div>
    <div class="detail-grid">
      <section class="detail-card">
        <h2>О станции</h2>
        <dl class="spec-list">
          <div>
            <dt><Zap :size="17" /> Мощность</dt>
            <dd>{{ stationPower(s) }}</dd>
          </div>
          <div>
            <dt><Plug :size="17" /> Разъёмы</dt>
            <dd>{{ s.connectors.join(', ') || 'Не указаны' }}</dd>
          </div>
          <div>
            <dt><Clock :size="17" /> Часы работы</dt>
            <dd>{{ s.hours || 'Уточните у оператора' }}</dd>
          </div>
          <div>
            <dt>Оплата</dt>
            <dd>{{ paymentLabel(s) }}</dd>
          </div>
          <div>
            <dt>Цена за кВт·ч</dt>
            <dd>
              {{ s.price === null ? 'Не подтверждена' : s.price + ' BYN' }}
            </dd>
          </div>
          <div>
            <dt>Онлайн-статус</dt>
            <dd>Нет live-данных</dd>
          </div>
        </dl>
        <p class="data-note">
          Данные источника загружены
          {{ new Date(s.updatedAt).toLocaleDateString('ru-BY') }}. Это не
          проверка работоспособности станции.
        </p>
        <a
          :href="s.source"
          class="text-link"
          target="_blank"
          rel="noopener noreferrer"
          >Источник / исправить в OSM <ExternalLink :size="15"
        /></a>
      </section>
      <MapView :stations="[s]" :center="[s.lat, s.lng]" :zoom="15" />
    </div>
    <div class="detail-grid section">
      <section class="detail-card">
        <h2>Фотографии</h2>
        <NuxtImg
          v-if="s.photo"
          :src="s.photo"
          :alt="s.name"
          width="800"
          height="500"
        />
        <div v-else class="photo-empty">
          <Plug :size="44" />
          <p>Фотографии этой станции пока не добавлены</p>
          <small>Адрес и положение на карте доступны выше.</small>
        </div>
      </section>
      <StationReviews :slug="s.slug" />
    </div>
  </div>
</template>
