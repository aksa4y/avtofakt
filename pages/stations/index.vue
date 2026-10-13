<script setup lang="ts">
import { filterStations } from '~/utils/stations'
const { data, error, refresh } = await useStations()
const route = useRoute()
const store = useFiltersStore()
const page = computed(() => {
  const n = Number(route.query.page || 1)
  return Number.isInteger(n) && n > 0 ? n : 1
})
const filtered = computed(() =>
  filterStations(data.value?.stations || [], store.$state),
)
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / 18)))
const visible = computed(() =>
  filtered.value.slice((page.value - 1) * 18, page.value * 18),
)
if (
  page.value > Math.max(1, Math.ceil((data.value?.stations.length || 0) / 18))
)
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница каталога не найдена',
  })
watch(
  () => store.$state,
  () => {
    if (page.value !== 1) navigateTo('/stations')
  },
  { deep: true },
)
const site = useRuntimeConfig().public.siteUrl
usePageSeo(
  `Каталог зарядных станций Беларуси${page.value > 1 ? ` — страница ${page.value}` : ''}`,
  'Адреса зарядных станций Беларуси, разъёмы, мощность и часы работы. Подберите зарядку для своего электромобиля.',
  `/stations${page.value > 1 ? `?page=${page.value}` : ''}`,
)
useHead(() => ({
  link: [
    ...(page.value > 1
      ? [
          {
            rel: 'prev',
            href: `${site}/stations${page.value > 2 ? `?page=${page.value - 1}` : ''}`,
          },
        ]
      : []),
    ...(page.value < pages.value
      ? [{ rel: 'next', href: `${site}/stations?page=${page.value + 1}` }]
      : []),
  ],
}))
useSchemaOrg([
  {
    '@type': 'ItemList',
    itemListElement: visible.value.map((s, i) => ({
      '@type': 'ListItem',
      position: (page.value - 1) * 18 + i + 1,
      url: `${site}/stations/${s.slug}`,
      name: s.name,
    })),
  },
])
</script>
<template>
  <div class="container page">
    <Breadcrumbs :items="[{ label: 'Каталог станций' }]" />
    <div class="page-heading">
      <span class="eyebrow">ЗНАЙ, ГДЕ ЗАРЯДИТЬСЯ</span>
      <h1>Каталог станций</h1>
      <p>Открытые данные. Понятные фильтры. Вся Беларусь.</p>
    </div>
    <StationFilters />
    <p class="results-count" aria-live="polite">
      Найдено {{ filtered.length }} станций · страница {{ page }} из {{ pages }}
    </p>
    <div v-if="error" class="empty-state">
      Ошибка загрузки. <button @click="refresh()">Повторить</button>
    </div>
    <div v-else-if="visible.length" class="station-grid">
      <StationCard
        v-for="s in visible"
        :key="s.id"
        :station="s"
        :heading-level="2"
      />
    </div>
    <div v-else class="empty-state">
      <h2>Станции не найдены</h2>
      <p>Измените фильтры, чтобы расширить поиск.</p>
      <button class="button button-primary" @click="store.$reset()">
        Сбросить
      </button>
    </div>
    <nav v-if="pages > 1" class="pagination" aria-label="Страницы каталога">
      <NuxtLink
        v-if="page > 1"
        :to="page === 2 ? '/stations' : `/stations?page=${page - 1}`"
        rel="prev"
        >← Назад</NuxtLink
      ><span>{{ page }} / {{ pages }}</span
      ><NuxtLink
        v-if="page < pages"
        :to="`/stations?page=${page + 1}`"
        rel="next"
        >Далее →</NuxtLink
      >
    </nav>
    <p class="data-note">
      Источник: © OpenStreetMap contributors, ODbL. Занятость, стоимость и
      состояние оборудования проверяйте в приложении оператора.
    </p>
  </div>
</template>
