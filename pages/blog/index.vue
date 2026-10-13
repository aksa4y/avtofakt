<script setup lang="ts">
import { articles } from '~/shared/content'
import { Plug, Zap, Route, ArrowUpRight } from 'lucide-vue-next'
usePageSeo(
  'Журнал об электромобилях и зарядках в Беларуси',
  'Практические статьи об электромобилях: разъёмы, стоимость зарядки, поездки по Беларуси и планирование остановок.',
)
</script>
<template>
  <div class="container page">
    <Breadcrumbs :items="[{ label: 'Журнал' }]" />
    <div class="page-heading">
      <span class="eyebrow">ЖУРНАЛ АВТОФАКТ</span>
      <h1>На одной волне</h1>
      <p>Практика электрической жизни. Без сложных терминов.</p>
    </div>
    <div class="article-grid">
      <NuxtLink
        v-for="(a, i) in articles"
        :key="a.slug"
        :to="`/blog/${a.slug}`"
        class="article-card"
        ><div class="article-art" :class="`art-${i}`">
          <Plug v-if="i === 0" :size="70" /><Zap
            v-else-if="i === 1"
            :size="70"
          /><Route v-else :size="70" /><span>0{{ i + 1 }}</span>
        </div>
        <div class="article-meta">
          {{ a.category }}<span>{{ a.minutes }} мин</span>
        </div>
        <h2>{{ a.title }}</h2>
        <p class="muted">{{ a.intro }}</p>
        <span class="text-link">Читать <ArrowUpRight :size="17" /></span
      ></NuxtLink>
    </div>
  </div>
</template>
