<script setup lang="ts">
import { Search, SlidersHorizontal, X } from 'lucide-vue-next'
import { DISTRICT_LABELS, SERVICE_LABELS, type District, type Service } from '~/types/station'
const props = defineProps<{ service: Service[]; district: District[]; activeCount: number; q: string }>()
const emit = defineEmits<{ toggleService: [Service]; toggleDistrict: [District]; updateQuery: [string]; reset: [] }>()
const showMobile = ref(false)
const serviceOptions = Object.entries(SERVICE_LABELS) as [Service, string][]
const districtOptions = Object.entries(DISTRICT_LABELS) as [District, string][]
</script>

<template>
  <div class="sticky top-0 z-30 -mx-4 border-y border-line bg-ink/90 px-4 py-3 backdrop-blur-xl md:static md:mx-0 md:border md:bg-panel md:p-5 md:rounded-2xl">
    <div class="flex gap-2 md:hidden">
      <label class="relative min-w-0 flex-1">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input :value="q" aria-label="Поиск по названию СТО" placeholder="Название сервиса" class="h-11 w-full rounded-xl border border-line bg-raised pl-9 pr-3 text-sm text-white placeholder:text-muted" @input="emit('updateQuery', ($event.target as HTMLInputElement).value)" />
      </label>
      <button class="flex h-11 items-center gap-2 rounded-xl border border-line bg-raised px-3 text-sm font-semibold" :aria-label="`Открыть фильтры, выбрано ${activeCount}`" @click="showMobile = true"><SlidersHorizontal class="h-4 w-4" />Фильтры<span v-if="activeCount" class="grid h-5 min-w-5 place-items-center rounded-full bg-lime px-1 text-xs text-ink">{{ activeCount }}</span></button>
    </div>

    <div class="hidden md:block">
      <div class="grid gap-5 lg:grid-cols-[1fr_1.2fr_auto] lg:items-end">
        <div>
          <p class="mb-2 text-xs font-bold uppercase tracking-[.16em] text-muted">Услуги</p>
          <div class="flex flex-wrap gap-2">
            <button v-for="([key, label]) in serviceOptions" :key="key" class="rounded-full border px-3 py-2 text-sm transition" :class="service.includes(key) ? 'border-lime bg-lime text-ink' : 'border-line bg-raised text-gray-300 hover:border-gray-500'" :aria-pressed="service.includes(key)" @click="emit('toggleService', key)">{{ label }}</button>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-bold uppercase tracking-[.16em] text-muted">Район</p>
          <div class="flex flex-wrap gap-2">
            <button v-for="([key, label]) in districtOptions" :key="key" class="rounded-full border px-3 py-2 text-sm transition" :class="district.includes(key) ? 'border-lime bg-lime text-ink' : 'border-line bg-raised text-gray-300 hover:border-gray-500'" :aria-pressed="district.includes(key)" @click="emit('toggleDistrict', key)">{{ label }}</button>
          </div>
        </div>
        <button v-if="activeCount" class="inline-flex items-center gap-1 self-end pb-2 text-sm text-muted hover:text-white" @click="emit('reset')"><X class="h-4 w-4" />Сбросить <span class="text-lime">{{ activeCount }}</span></button>
      </div>
      <label class="relative mt-5 block max-w-md">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input :value="q" aria-label="Поиск по названию СТО" placeholder="Найти сервис по названию" class="h-11 w-full rounded-xl border border-line bg-raised pl-9 pr-3 text-sm text-white placeholder:text-muted" @input="emit('updateQuery', ($event.target as HTMLInputElement).value)" />
      </label>
    </div>

    <Teleport to="body">
      <div v-if="showMobile" class="fixed inset-0 z-50 flex items-end bg-black/65 md:hidden" @click.self="showMobile = false">
        <section role="dialog" aria-modal="true" aria-labelledby="filter-title" class="max-h-[88dvh] w-full overflow-y-auto rounded-t-3xl border border-line bg-panel p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] soft-shadow">
          <div class="mb-6 flex items-center justify-between"><h2 id="filter-title" class="font-display text-xl font-bold">Фильтры <span v-if="activeCount" class="text-lime">({{ activeCount }})</span></h2><button class="rounded-full p-2 text-muted hover:text-white" aria-label="Закрыть фильтры" @click="showMobile = false"><X class="h-5 w-5" /></button></div>
          <p class="mb-3 text-xs font-bold uppercase tracking-[.16em] text-muted">Услуги</p><div class="mb-6 flex flex-wrap gap-2"><button v-for="([key,label]) in serviceOptions" :key="key" class="rounded-full border px-3 py-2 text-sm" :class="service.includes(key)?'border-lime bg-lime text-ink':'border-line bg-raised text-gray-300'" :aria-pressed="service.includes(key)" @click="emit('toggleService',key)">{{ label }}</button></div>
          <p class="mb-3 text-xs font-bold uppercase tracking-[.16em] text-muted">Район</p><div class="mb-7 flex flex-wrap gap-2"><button v-for="([key,label]) in districtOptions" :key="key" class="rounded-full border px-3 py-2 text-sm" :class="district.includes(key)?'border-lime bg-lime text-ink':'border-line bg-raised text-gray-300'" :aria-pressed="district.includes(key)" @click="emit('toggleDistrict',key)">{{ label }}</button></div>
          <div class="flex gap-3"><button class="h-12 flex-1 rounded-xl border border-line font-semibold" @click="emit('reset')">Сбросить</button><button class="h-12 flex-[1.4] rounded-xl bg-lime font-bold text-ink" @click="showMobile = false">Показать сервисы</button></div>
        </section>
      </div>
    </Teleport>
  </div>
</template>
