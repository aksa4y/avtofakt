<script setup lang="ts">
import { ArrowDownUp, ArrowRight, CarFront, ChevronLeft, ChevronRight, MapPin, Moon, SlidersHorizontal, Sun } from 'lucide-vue-next'
import { useDebounceFn } from '@vueuse/core'
import StationFilters from '~/components/StationFilters.vue'
import StationCard from '~/components/StationCard.vue'
import StationSkeleton from '~/components/StationSkeleton.vue'
import { DISTRICT_LABELS, SERVICE_LABELS } from '~/types/station'

const { filters, activeCount, set, toggle, reset } = useFilters()
const { data, pending, error } = await useStations(filters)
const isOnline = useOnline()
const colorMode = ref<'dark' | 'light'>('dark')
const toggleTheme = () => {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
  if (import.meta.client) localStorage.setItem('avtofakt-theme', colorMode.value)
  document.documentElement.classList.toggle('light-mode', colorMode.value === 'light')
}
const scrollToCatalog = () => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
onMounted(() => {
  const saved = localStorage.getItem('avtofakt-theme')
  if (saved === 'light') { colorMode.value = 'light'; document.documentElement.classList.add('light-mode') }
})
const queryDraft = ref(filters.value.q)
watch(() => filters.value.q, value => { queryDraft.value = value })
const updateQuery = useDebounceFn((value: string) => set('q', value), 250)
const currentPage = computed(() => data.value?.page ?? filters.value.page)
const pageCount = computed(() => Math.max(1, Math.ceil((data.value?.total ?? 0) / (data.value?.pageSize ?? 9))))
const title = computed(() => {
  const service = filters.value.service.map(item => SERVICE_LABELS[item]).join(', ')
  const district = filters.value.district.map(item => DISTRICT_LABELS[item]).join(', ')
  return [service, district].filter(Boolean).join(' · ') || 'СТО Минска'
})
useSeoMeta({ title: () => `${title.value} — автосервисы | Автофакт`, description: () => `Найдите автосервис в Минске: ${title.value.toLowerCase()}, адреса, телефоны, рейтинг и график работы.`, ogTitle: () => `${title.value} в Минске — Автофакт`, ogDescription: 'Каталог автосервисов Минска. Сравните услуги, оценки, цены и адреса.', ogType: 'website' })
useHead({ link: [{ rel: 'canonical', href: 'https://avtofakt.by/' }] })
const jsonLd = computed(() => ({ '@context':'https://schema.org', '@type':'ItemList', name:`${title.value} в Минске`, itemListElement:(data.value?.items ?? []).map((station,index) => ({ '@type':'ListItem', position:index+1, item:{ '@type':'AutomotiveBusiness', name:station.name, telephone:station.phone, address:{ '@type':'PostalAddress', streetAddress:station.address, addressLocality:'Минск', addressCountry:'BY' }, aggregateRating:{ '@type':'AggregateRating', ratingValue:station.rating, reviewCount:station.reviewCount } } })) }))
useHead(() => ({ script: [{ type:'application/ld+json', innerHTML: JSON.stringify(jsonLd.value) }] }))
</script>

<template>
  <main class="min-h-screen pb-24 md:pb-16">
    <header class="border-b border-line"><div class="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10"><a href="/" class="flex items-center gap-2.5" aria-label="Автофакт — главная"><span class="grid h-9 w-9 place-items-center rounded-lg bg-orange text-white"><CarFront class="h-5 w-5"/></span><span class="font-display text-2xl font-semibold tracking-wide">АВТОФАКТ<span class="text-orange">.</span></span></a><nav class="hidden items-center gap-7 text-sm text-muted md:flex" aria-label="Основная навигация"><a href="#catalog" class="transition hover:text-white">Каталог</a><a href="#catalog" class="transition hover:text-white">Подобрать СТО</a><a href="#about" class="transition hover:text-white">О проекте</a></nav><div class="flex items-center gap-2"><button class="grid h-10 w-10 place-items-center rounded-lg border border-line text-muted transition hover:text-white" :aria-label="colorMode === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'" @click="toggleTheme"><Sun v-if="colorMode === 'dark'" class="h-4 w-4"/><Moon v-else class="h-4 w-4"/></button><a href="#add" class="rounded-lg border border-line px-3.5 py-2.5 text-sm font-semibold transition hover:border-orange/60 hover:text-orange">Добавить СТО <ArrowRight class="ml-1 inline h-4 w-4"/></a></div></div></header>

    <section class="mx-auto grid max-w-[1440px] gap-7 px-4 py-9 sm:px-6 sm:py-12 lg:grid-cols-[1fr_0.94fr] lg:items-center lg:gap-12 lg:px-10 lg:py-16">
      <div><div class="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-orange"><span class="h-px w-7 bg-orange"/>Автосервисы Минска</div><h1 class="font-display max-w-2xl text-5xl font-semibold uppercase leading-[.94] tracking-wide text-white sm:text-6xl lg:text-[76px]">Найдите СТО<br/>для своей машины</h1><p class="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">Подберите мастерскую по услуге и району. В карточке — адрес, телефон, график и оценки посетителей.</p><div class="mt-7 flex flex-wrap items-center gap-4"><a href="#catalog" class="inline-flex h-12 items-center gap-3 rounded-lg bg-orange px-5 text-sm font-bold text-white transition hover:bg-orange/90">Смотреть сервисы <ArrowRight class="h-4 w-4"/></a><span class="inline-flex items-center gap-2 text-sm text-muted"><MapPin class="h-4 w-4 text-orange"/>Минск и Минский район</span></div></div>
      <div class="relative min-h-[240px] overflow-hidden rounded-xl border border-line bg-raised sm:min-h-[340px]"><img src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1400&q=85" alt="Работа в автосервисе" class="absolute inset-0 h-full w-full object-cover object-center" fetchpriority="high"/><div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent"/><div class="absolute bottom-0 left-0 right-0 p-5 sm:p-7"><p class="text-xs font-bold uppercase tracking-[.16em] text-orange">Ремонт · диагностика · обслуживание</p><p class="mt-2 font-display text-3xl font-semibold uppercase text-white sm:text-4xl">Выберите сервис под задачу</p></div></div>
    </section>

    <section id="catalog" class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10"><div class="mb-5 flex items-end justify-between gap-3"><div><div class="mb-2 text-sm text-muted"><a href="/" class="hover:text-white">Главная</a><span class="px-2">/</span><span class="text-gray-300">Каталог СТО</span></div><h2 class="font-display text-3xl font-semibold uppercase tracking-wide sm:text-4xl">{{ title }}</h2><p class="mt-1.5 text-sm text-muted">{{ data?.total ?? 0 }} автосервисов в Минске</p></div><div class="hidden items-center gap-2 sm:flex"><label for="sort" class="text-sm text-muted">Сортировка</label><div class="relative"><ArrowDownUp class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"/><select id="sort" :value="filters.sort" class="h-10 appearance-none rounded-lg border border-line bg-raised pl-9 pr-9 text-sm text-white" @change="set('sort', ($event.target as HTMLSelectElement).value as typeof filters.sort)"><option value="rating">По рейтингу</option><option value="reviews">По отзывам</option><option value="price">Сначала дешевле</option><option value="name">По названию</option><option value="distance">По расстоянию</option></select></div></div></div>

      <StationFilters :service="filters.service" :district="filters.district" :active-count="activeCount" :q="queryDraft" @toggle-service="toggle('service', $event)" @toggle-district="toggle('district', $event)" @update-query="updateQuery" @reset="reset"/>
      <div class="mb-4 mt-5 flex items-center justify-between sm:hidden"><span class="text-sm text-muted">{{ data?.total ?? 0 }} найдено</span><label class="flex items-center gap-2 text-sm text-muted"><ArrowDownUp class="h-4 w-4"/><select :value="filters.sort" aria-label="Сортировка" class="bg-ink text-gray-200" @change="set('sort', ($event.target as HTMLSelectElement).value as typeof filters.sort)"><option value="rating">Рейтинг</option><option value="reviews">Отзывы</option><option value="price">Цена</option><option value="name">Название</option></select></label></div>

      <div v-if="!isOnline" role="status" class="my-4 rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">Нет подключения к интернету. Каталог может отображать сохранённые данные.</div>
      <div v-if="error" role="alert" class="mt-5 rounded-2xl border border-danger/30 bg-danger/5 p-8 text-center"><p class="font-semibold">Не удалось загрузить каталог</p><p class="mt-2 text-sm text-muted">Проверьте соединение и попробуйте ещё раз.</p><button class="mt-4 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15" @click="refreshNuxtData()">Повторить</button></div>
      <div v-else-if="pending" class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"><StationSkeleton/></div>
      <template v-else-if="data?.items.length"><TransitionGroup name="cards" tag="div" class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"><StationCard v-for="station in data.items" :key="station.id" :station="station"/></TransitionGroup><nav v-if="pageCount>1" class="mt-8 flex items-center justify-center gap-2" aria-label="Страницы каталога"><button class="grid h-10 w-10 place-items-center rounded-xl border border-line disabled:opacity-30" aria-label="Предыдущая страница" :disabled="currentPage===1" @click="set('page',currentPage-1)"><ChevronLeft class="h-4 w-4"/></button><span class="px-3 text-sm text-muted">Страница {{ currentPage }} из {{ pageCount }}</span><button class="grid h-10 w-10 place-items-center rounded-xl border border-line disabled:opacity-30" aria-label="Следующая страница" :disabled="currentPage===pageCount" @click="set('page',currentPage+1)"><ChevronRight class="h-4 w-4"/></button></nav></template>
      <div v-else-if="!pending" class="panel mt-5 rounded-xl px-6 py-14 text-center"><div class="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-raised text-muted"><SlidersHorizontal class="h-7 w-7"/></div><h3 class="mt-5 font-display text-xl font-bold">Ничего не нашлось</h3><p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">Попробуйте изменить запрос или снять часть фильтров — подходящий сервис может быть рядом.</p><button class="mt-5 rounded-lg bg-orange px-5 py-3 text-sm font-bold text-white" @click="reset">Сбросить фильтры</button></div>
    </section>
    <footer id="about" class="mx-auto mt-16 max-w-[1440px] border-t border-line px-4 py-8 text-sm text-muted sm:px-6 lg:px-10"><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Автофакт · Каталог автосервисов Минска</span><a id="add" href="mailto:hello@avtofakt.by" class="hover:text-white">Добавить или обновить СТО</a></div></footer>
    <Transition name="fade"><a v-if="activeCount" href="#catalog" class="fixed bottom-4 left-4 right-4 z-20 hidden h-12 items-center justify-center gap-2 rounded-lg bg-orange font-bold text-white shadow-lg sm:hidden" @click.prevent="scrollToCatalog"><SlidersHorizontal class="h-4 w-4"/>Фильтры · {{ activeCount }}</a></Transition>
  </main>
</template>

<style scoped>
.cards-enter-active,.cards-leave-active,.cards-move{transition:opacity .18s ease,transform .18s ease}.cards-enter-from,.cards-leave-to{opacity:0;transform:translateY(8px)}.cards-leave-active{position:absolute;width:calc(33.333% - 12px)}.fade-enter-active,.fade-leave-active{transition:opacity .15s}.fade-enter-from,.fade-leave-to{opacity:0}
@media(max-width:639px){.cards-leave-active{position:relative;width:auto}}
</style>
