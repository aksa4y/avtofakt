<script setup lang="ts">
import { ArrowUpRight, BadgeCheck, Clock3, MapPin, Navigation, Phone, Star } from 'lucide-vue-next'
import type { Station } from '~/types/station'
import { DISTRICT_LABELS, SERVICE_LABELS } from '~/types/station'
import { mapsUrl } from '~/utils/maps'
const props = defineProps<{ station: Station }>()
const { isOpen, label } = useOpenStatus(props.station)
const price = '₽'.repeat(props.station.price) + '·'.repeat(3 - props.station.price)
const address = props.station.address
const mapLink = mapsUrl(address)
</script>

<template>
  <article class="group panel soft-shadow rounded-2xl p-4 transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-raised focus-within:border-lime/60 sm:p-5">
    <div class="mb-4 flex items-start gap-3">
      <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-lime/20 to-lime/5 font-display text-sm font-extrabold text-lime">{{ station.shortName }}</div>
      <div class="min-w-0 flex-1"><div class="flex items-center gap-1.5"><h3 class="truncate font-display text-lg font-bold text-white">{{ station.name }}</h3><BadgeCheck v-if="station.verified" class="h-4 w-4 shrink-0 text-lime" aria-label="Проверенный сервис" /></div><p class="mt-1 text-xs text-muted">{{ DISTRICT_LABELS[station.district] }} район <span class="px-1">·</span><span :class="isOpen?'text-success':'text-muted'">{{ label }}</span></p></div>
      <a :href="mapLink" target="_blank" rel="noopener noreferrer" class="rounded-lg p-2 text-muted transition hover:bg-white/5 hover:text-white" :aria-label="`Открыть ${station.name} на карте`"><ArrowUpRight class="h-4 w-4" /></a>
    </div>
    <div class="mb-3 flex items-center gap-2"><span class="inline-flex items-center gap-1 rounded-lg bg-amber/10 px-2 py-1 text-sm font-bold text-amber"><Star class="h-3.5 w-3.5 fill-current" />{{ station.rating.toFixed(1) }}</span><span class="text-sm text-muted">{{ station.reviewCount }} отзывов</span><span class="ml-auto text-sm font-semibold tracking-widest text-gray-300" :aria-label="`Ценовой уровень ${station.price} из 3`">{{ price }}</span></div>
    <div class="mb-4 flex min-h-12 flex-wrap content-start gap-1.5"><span v-for="service in station.services" :key="service" class="rounded-md border border-line bg-raised px-2 py-1 text-xs text-gray-300">{{ SERVICE_LABELS[service] }}</span></div>
    <div class="space-y-2.5 border-t border-line pt-3 text-sm text-gray-300">
      <p class="flex gap-2"><MapPin class="mt-0.5 h-4 w-4 shrink-0 text-muted"/><span>{{ address }}</span></p>
      <p class="flex items-center gap-2"><Clock3 class="h-4 w-4 shrink-0" :class="isOpen?'text-success':'text-muted'"/><span>{{ station.hours.open }}–{{ station.hours.close }}, ежедневно</span></p>
    </div>
    <div class="mt-4 grid grid-cols-2 gap-2"><a :href="`tel:${station.phone.replace(/[^+\d]/g,'')}`" class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-lime font-bold text-ink transition hover:bg-lime/90"><Phone class="h-4 w-4"/>Позвонить</a><a :href="mapLink" target="_blank" rel="noopener noreferrer" class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white/[.03] text-sm font-semibold transition hover:border-white/30 hover:bg-white/[.07]"><Navigation class="h-4 w-4"/>Маршрут</a></div>
  </article>
</template>
