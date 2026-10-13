<script setup lang="ts">
import { Zap, ArrowUpRight, MapPin, Plug, Clock } from 'lucide-vue-next'
import type { Station } from '~/types/station'
import { stationPower, paymentLabel } from '~/utils/stations'
defineProps<{ station: Station }>()
</script>
<template>
  <article class="station-card">
    <div class="station-top">
      <span class="operator-mark"><Zap :size="23" /></span
      ><span class="operator-name">{{ station.operator }}</span
      ><span class="status-dot" title="Онлайн-статус не подключён" />
    </div>
    <NuxtLink :to="`/stations/${station.slug}`" class="station-title"
      ><h3>{{ station.name }}</h3>
      <ArrowUpRight :size="21"
    /></NuxtLink>
    <p class="station-address"><MapPin :size="14" />{{ station.address }}</p>
    <div class="station-spec">
      <strong>{{ stationPower(station) }}</strong
      ><span>{{ paymentLabel(station) }}</span>
    </div>
    <div class="station-connectors">
      <span v-for="c in station.connectors" :key="c"
        ><Plug :size="13" />{{ c }}</span
      ><span v-if="!station.connectors.length">Разъёмы уточняются</span>
    </div>
    <div class="station-bottom">
      <span
        ><Clock :size="13" />
        {{
          station.hours === '24/7'
            ? 'Круглосуточно'
            : station.hours || 'График уточняется'
        }}</span
      ><span>Нет live-данных</span>
    </div>
  </article>
</template>
