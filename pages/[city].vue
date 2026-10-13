<script setup lang="ts">
import { cities } from '~/shared/cities'
const route = useRoute()
const city = cities.find((c) => `/${c.slug}` === route.path)
if (!city)
  throw createError({ statusCode: 404, statusMessage: 'Страница не найдена' })
usePageSeo(
  `Зарядные станции в ${city.locative} — карта электрозарядок`,
  `Карта зарядок в ${city.locative}: адреса, разъёмы CCS, Type 2, CHAdeMO и GB/T, мощность и часы работы. Найдите станцию рядом.`,
)
</script>
<template>
  <div class="container page">
    <Breadcrumbs :items="[{ label: city.name }]" />
    <div class="page-heading">
      <span class="eyebrow">{{ city.region }}</span>
      <h1>Зарядные станции<br />в {{ city.locative }}</h1>
      <p>
        Станции в городе и радиусе 25 км от центра. Выберите разъём для
        следующей остановки.
      </p>
    </div>
    <StationExplorer :city="city.slug" />
    <section class="prose section">
      <h2>Как выбрать зарядку в {{ city.locative }}</h2>
      <p>
        Сначала проверьте совместимость разъёма с автомобилем, затем выберите
        мощность. Для ночной парковки подойдёт AC, для короткой остановки —
        совместимая DC-станция. Возможности автомобиля могут ограничивать
        скорость зарядки.
      </p>
      <p>
        Перед поездкой проверьте тариф и доступность в приложении оператора.
        Данные каталога справочные; график парковки может отличаться от часов
        работы зарядного оборудования.
      </p>
      <h2>Другие города Беларуси</h2>
      <div class="city-links">
        <NuxtLink
          v-for="c in cities.filter((c) => c.slug !== city.slug)"
          :key="c.slug"
          :to="`/${c.slug}`"
          >{{ c.name }} ↗</NuxtLink
        >
      </div>
      <NuxtLink class="text-link" to="/stations"
        >Все станции Беларуси →</NuxtLink
      >
    </section>
  </div>
</template>
