<script setup lang="ts">
import { ArrowUpRight, BadgeCheck, Clock3, MapPin, Navigation, Phone, Star, Wrench } from 'lucide-vue-next'
import type { Station } from '~/types/station'
import { DISTRICT_LABELS, SERVICE_LABELS } from '~/types/station'
import { mapsUrl } from '~/utils/maps'

const props = defineProps<{ station: Station }>()
const { isOpen, label } = useOpenStatus(props.station)
const price = '₽'.repeat(props.station.price)
const address = props.station.address
const mapLink = mapsUrl(address)
</script>

<template>
  <article class="group panel flex h-full flex-col rounded-xl p-4 transition duration-200 hover:-translate-y-0.5 hover:border-white/20 sm:p-5">
    <div class="flex items-start gap-3">
      <div class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-orange/25 bg-orange/10 text-orange">
        <Wrench class="h-[18px] w-[18px]" aria-hidden="true" />
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1.5">
          <h3 class="truncate font-display text-[23px] font-semibold leading-none text-white">{{ station.name }}</h3>
          <BadgeCheck v-if="station.verified" class="h-4 w-4 shrink-0 text-orange" aria-label="Проверенный сервис" />
        </div>
        <p class="mt-2 text-xs text-muted">{{ DISTRICT_LABELS[station.district] }} район</p>
      </div>
      <a :href="mapLink" target="_blank" rel="noopener noreferrer" class="rounded-md p-2 text-muted transition hover:bg-white/5 hover:text-white" :aria-label="`Открыть ${station.name} на карте`">
        <ArrowUpRight class="h-4 w-4" />
      </a>
    </div>

    <div class="mt-4 flex items-center gap-2 text-sm">
      <span class="inline-flex items-center gap-1 font-semibold text-amber"><Star class="h-3.5 w-3.5 fill-current" />{{ station.rating.toFixed(1) }}</span>
      <span class="text-muted">{{ station.reviewCount }} отзывов</span>
      <span class="ml-auto font-semibold tracking-wider text-gray-300" :aria-label="`Ценовой уровень ${station.price} из 3`">{{ price }}</span>
    </div>

    <div class="mt-4 flex min-h-8 flex-wrap content-start gap-1.5">
      <span v-for="service in station.services" :key="service" class="rounded-md border border-line bg-raised px-2 py-1 text-xs text-gray-300">{{ SERVICE_LABELS[service] }}</span>
    </div>

    <div class="mt-4 space-y-2.5 border-t border-line pt-3 text-sm text-gray-300">
      <p class="flex gap-2.5"><MapPin class="mt-0.5 h-4 w-4 shrink-0 text-muted" /><span>{{ address }}</span></p>
      <p class="flex items-center gap-2.5"><Clock3 class="h-4 w-4 shrink-0" :class="isOpen ? 'text-success' : 'text-muted'" /><span>{{ station.hours.open }}–{{ station.hours.close }}, ежедневно</span><span class="ml-auto text-xs" :class="isOpen ? 'text-success' : 'text-muted'">{{ label }}</span></p>
    </div>

    <div class="mt-auto grid grid-cols-2 gap-2 pt-5">
      <a :href="`tel:${station.phone.replace(/[^+\d]/g, '')}`" class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-orange px-3 text-sm font-bold text-ink transition hover:bg-orange/90">
        <Phone class="h-4 w-4" />Позвонить
      </a>
      <a :href="mapLink" target="_blank" rel="noopener noreferrer" class="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-gray-300 transition hover:border-white/30 hover:text-white">
        <Navigation class="h-4 w-4" />Маршрут
      </a>
    </div>
  </article>
</template>
