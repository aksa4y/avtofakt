<script setup lang="ts">
import { filterStations } from '~/utils/stations'
import { cities } from '~/shared/cities'
const props = defineProps<{
  city?: string
  fullMap?: boolean
  showList?: boolean
}>()
const { data, error, refresh } = await useStations()
const store = useFiltersStore()
const filtered = computed(() =>
  filterStations(data.value?.stations || [], {
    ...store.$state,
    city: props.city || store.city,
  }),
)
const activeCity = computed(() =>
  cities.find((c) => c.slug === (props.city || store.city)),
)
const center = computed<[number, number]>(() =>
  activeCity.value
    ? [activeCity.value.lat, activeCity.value.lng]
    : [53.9023, 27.5619],
)
const page = ref(1)
const pageSize = 12
const pages = computed(() => Math.ceil(filtered.value.length / pageSize))
watch(filtered, () => {
  page.value = 1
})
const visible = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize),
)
</script>
<template>
  <div>
    <StationFilters :hide-city="!!city" />
    <div v-if="error" class="empty-state" role="alert">
      Не удалось загрузить станции.
      <button class="text-link" @click="refresh()">Повторить</button>
    </div>
    <template v-else
      ><div :class="{ 'full-map': fullMap }">
        <MapView :stations="filtered" :center="center" />
      </div>
      <div v-if="showList !== false" class="results-heading">
        <h2>
          Станции <span class="count-badge">{{ filtered.length }}</span>
        </h2>
        <p>Источник: OpenStreetMap · Live-статус не подключён</p>
      </div>
      <div v-if="showList !== false && filtered.length" class="station-grid">
        <StationCard v-for="s in visible" :key="s.id" :station="s" />
      </div>
      <div v-else-if="showList !== false" class="empty-state">
        <h3>По этим фильтрам станций не найдено</h3>
        <p>Попробуйте снизить мощность или выбрать другой разъём.</p>
        <button class="button button-primary" @click="store.$reset()">
          Сбросить фильтры
        </button>
      </div>
      <nav
        v-if="showList !== false && pages > 1"
        class="pagination"
        aria-label="Страницы результатов"
      >
        <button :disabled="page === 1" @click="page--">Назад</button
        ><span aria-live="polite">{{ page }} / {{ pages }}</span
        ><button :disabled="page === pages" @click="page++">Далее</button>
      </nav></template
    >
  </div>
</template>
