<script setup lang="ts">
import type { Station } from '~/types/station'
withDefaults(
  defineProps<{
    stations: Station[]
    center?: [number, number]
    zoom?: number
  }>(),
  { center: () => [53.9023, 27.5619], zoom: 11 },
)
</script>
<template>
  <ClientOnly
    ><LazyChargingMap
      :stations="stations"
      :center="center"
      :zoom="zoom"
    /><template #fallback
      ><div class="map-placeholder">
        <span class="map-loader" />Загружаем карту Беларуси…<small
          >Адреса и характеристики доступны в каталоге ниже.</small
        >
      </div></template
    ></ClientOnly
  >
</template>
