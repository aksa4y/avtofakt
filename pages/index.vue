<script setup lang="ts">
import { ArrowDownUp, ArrowRight, CarFront, ChevronLeft, ChevronRight, MapPin, ShieldCheck, SlidersHorizontal, Wrench } from 'lucide-vue-next'
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
useSeoMeta({ title: () => `${title.value} — автосервисы | Автофакт`, description: () => `Найдите автосервис в Минске: ${title.value.toLowerCase()}, адреса, телефоны, рейтинг и график работы.`, ogTitle: () => `${title.value} в Минске — Автофакт`, ogDescription: 'Каталог проверенных автосервисов Минска. Сравните рейтинг, цены и услуги.', ogType: 'website' })
useHead({ link: [{ rel: 'canonical', href: 'https://avtofakt.by/' }] })
const jsonLd = computed(() => ({ '@context':'https://schema.org', '@type':'ItemList', name:`${title.value} в Минске`, itemListElement:(data.value?.items ?? []).map((station,index) => ({ '@type':'ListItem', position:index+1, item:{ '@type':'AutomotiveBusiness', name:station.name, telephone:station.phone, address:{ '@type':'PostalAddress', streetAddress:station.address, addressLocality:'Минск', addressCountry:'BY' }, aggregateRating:{ '@type':'AggregateRating', ratingValue:station.rating, reviewCount:station.reviewCount } } })) }))
useHead(() => ({ script: [{ type:'application/ld+json', innerHTML: JSON.stringify(jsonLd.value) }] }))
const crumbs = [{ name:'Главная', href:'/' }, { name:'СТО Минска', href:'/' }]
</script>

<template>
  <main class="min-h-screen pb-24 md:pb-16">
    <header class="border-b border-line/70"><div class="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10"><a href="/" class="flex items-center gap-2.5" aria-label="Автофакт — главная"><span class="grid h-9 w-9 place-items-center rounded-xl bg-lime text-ink"><CarFront class="h-5 w-5"/></span><span class="font-display text-lg font-extrabold tracking-tight">автофакт<span class="text-lime">.</span></span></a><nav class="hidden items-center gap-7 text-sm text-muted md:flex" aria-label="Основная навигация"><a href="#catalog" class="transition hover:text-white">Каталог СТО</a><a href="#how" class="transition hover:text-white">Как выбрать</a><a href="#about" class="transition hover:text-white">О проекте</a></nav><div class="flex items-center gap-2"><button class="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted transition hover:text-white" :aria-label="colorMode === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'" @click="toggleTheme">◐</button><a href="#add" class="rounded-xl border border-line px-3.5 py-2.5 text-sm font-semibold transition hover:border-lime/60 hover:text-lime">Добавить СТО <ArrowRight class="ml-1 inline h-4 w-4"/></a></div></div></header>

    <section class="relative overflow-hidden"><div class="pointer-events-none absolute -right-44 -top-24 h-[440px] w-[440px] rounded-full bg-lime/[.07] blur-[100px]"/><div class="relative mx-auto grid max-w-[1440px] gap-8 px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14 lg:grid-cols-[1fr_330px] lg:px-10 lg:pb-16 lg:pt-16">
      <div><div class="mb-5 inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/[.06] px-3 py-1.5 text-xs font-semibold text-lime"><MapPin class="h-3.5 w-3.5"/>Минск и Минский район</div><h1 class="font-display max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-[-.04em] sm:text-5xl lg:text-[58px]">Найдите СТО,<br class="hidden sm:block"/> которому <span class="text-lime">можно доверять</span></h1><p class="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">Проверенные автосервисы Минска — сравните услуги, рейтинг и цены, чтобы выбрать без лишних звонков.</p><div class="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-300"><span class="inline-flex items-center gap-2"><ShieldCheck class="h-4 w-4 text-lime"/>{{ data?.total ?? 0 }} сервиса в каталоге</span><span class="inline-flex items-center gap-2"><Wrench class="h-4 w-4 text-lime"/>4 направления ремонта</span></div></div>
      <aside class="panel soft-shadow rounded-2xl p-5 sm:p-6"><p class="text-xs font-bold uppercase tracking-[.16em] text-muted">Подобрать сервис</p><p class="mt-2 font-display text-xl font-bold">Всё нужное — рядом</p><p class="mt-2 text-sm leading-6 text-muted">Выберите услугу и район — покажем подходящие мастерские.</p><a href="#catalog" class="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-lime font-bold text-ink transition hover:bg-lime/90">Подобрать СТО <ArrowRight class="h-4 w-4"/></a><p class="mt-3 text-center text-xs text-muted">Без регистрации и навязчивых звонков</p></aside>
    </div></section>

    <section id="catalog" class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10"><div class="mb-5 flex items-end justify-between gap-3"><div><div class="mb-2 text-sm text-muted"><a href="/" class="hover:text-white">Главная</a><span class="px-2">/</span><span class="text-gray-300">Каталог СТО</span></div><h2 class="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{{ title }}</h2><p class="mt-1.5 text-sm text-muted">{{ data?.total ?? 0 }} автосервисов в Минске</p></div><div class="hidden items-center gap-2 sm:flex"><label for="sort" class="text-sm text-muted">Сортировка</label><div class="relative"><ArrowDownUp class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"/><select id="sort" :value="filters.sort" class="h-10 appearance-none rounded-xl border border-line bg-raised pl-9 pr-9 text-sm text-white" @change="set('sort', ($event.target as HTMLSelectElement).value as typeof filters.sort)"><option value="rating">По рейтингу</option><option value="reviews">По отзывам</option><option value="price">Сначала дешевле</option><option value="name">По названию</option><option value="distance">По расстоянию</option></select></div></div></div>

      <StationFilters :service="filters.service" :district="filters.district" :active-count="activeCount" :q="queryDraft" @toggle-service="toggle('service', $event)" @toggle-district="toggle('district', $event)" @update-query="updateQuery" @reset="reset"/>
      <div class="mb-4 mt-5 flex items-center justify-between sm:hidden"><span class="text-sm text-muted">{{ data?.total ?? 0 }} найдено</span><label class="flex items-center gap-2 text-sm text-muted"><ArrowDownUp class="h-4 w-4"/><select :value="filters.sort" aria-label="Сортировка" class="bg-ink text-gray-200" @change="set('sort', ($event.target as HTMLSelectElement).value as typeof filters.sort)"><option value="rating">Рейтинг</option><option value="reviews">Отзывы</option><option value="price">Цена</option><option value="name">Название</option></select></label></div>

      <div v-if="!isOnline" role="status" class="my-4 rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">Нет подключения к интернету. Каталог может отображать сохранённые данные.</div>
      <div v-if="error" role="alert" class="mt-5 rounded-2xl border border-danger/30 bg-danger/5 p-8 text-center"><p class="font-semibold">Не удалось загрузить каталог</p><p class="mt-2 text-sm text-muted">Проверьте соединение и попробуйте ещё раз.</p><button class="mt-4 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15" @click="refreshNuxtData()">Повторить</button></div>
      <div v-else-if="pending" class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"><StationSkeleton/></div>
      <template v-else-if="data?.items.length"><TransitionGroup name="cards" tag="div" class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"><StationCard v-for="station in data.items" :key="station.id" :station="station"/></TransitionGroup><nav v-if="pageCount>1" class="mt-8 flex items-center justify-center gap-2" aria-label="Страницы каталога"><button class="grid h-10 w-10 place-items-center rounded-xl border border-line disabled:opacity-30" aria-label="Предыдущая страница" :disabled="currentPage===1" @click="set('page',currentPage-1)"><ChevronLeft class="h-4 w-4"/></button><span class="px-3 text-sm text-muted">Страница {{ currentPage }} из {{ pageCount }}</span><button class="grid h-10 w-10 place-items-center rounded-xl border border-line disabled:opacity-30" aria-label="Следующая страница" :disabled="currentPage===pageCount" @click="set('page',currentPage+1)"><ChevronRight class="h-4 w-4"/></button></nav></template>
      <div v-else-if="!pending" class="panel mt-5 rounded-3xl px-6 py-14 text-center"><div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-muted"><SlidersHorizontal class="h-7 w-7"/></div><h3 class="mt-5 font-display text-xl font-bold">Ничего не нашлось</h3><p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">Попробуйте изменить запрос или снять часть фильтров — подходящий сервис может быть рядом.</p><button class="mt-5 rounded-xl bg-lime px-5 py-3 text-sm font-bold text-ink" @click="reset">Сбросить фильтры</button></div>
    </section>
    <footer id="about" class="mx-auto mt-16 max-w-[1440px] border-t border-line px-4 py-8 text-sm text-muted sm:px-6 lg:px-10"><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Автофакт · Каталог автосервисов Минска</span><a id="add" href="mailto:hello@avtofakt.by" class="hover:text-white">Добавить или обновить СТО</a></div></footer>
    <Transition name="fade"><a v-if="activeCount" href="#catalog" class="fixed bottom-4 left-4 right-4 z-20 hidden h-12 items-center justify-center gap-2 rounded-xl bg-lime font-bold text-ink shadow-2xl sm:hidden" @click.prevent="document.getElementById('catalog')?.scrollIntoView({behavior:'smooth'})"><SlidersHorizontal class="h-4 w-4"/>Фильтры · {{ activeCount }}</a></Transition>
  </main>
</template>

<style scoped>
.cards-enter-active,.cards-leave-active,.cards-move{transition:opacity .18s ease,transform .18s ease}.cards-enter-from,.cards-leave-to{opacity:0;transform:translateY(8px)}.cards-leave-active{position:absolute;width:calc(33.333% - 12px)}.fade-enter-active,.fade-leave-active{transition:opacity .15s}.fade-enter-from,.fade-leave-to{opacity:0}
@media(max-width:639px){.cards-leave-active{position:relative;width:auto}}
</style>
