<script setup lang="ts">
import { faq } from '~/shared/content'
usePageSeo(
  'Вопросы о зарядке электромобилей в Беларуси',
  'Как найти зарядку, выбрать разъём, узнать тариф и проверить доступность. Ответы на частые вопросы водителей электромобилей в Беларуси.',
)
useSchemaOrg([
  {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
])
</script>
<template>
  <div class="container page narrow">
    <Breadcrumbs :items="[{ label: 'Вопросы и ответы' }]" />
    <div class="page-heading">
      <span class="eyebrow">ПОМОЩЬ В ПУТИ</span>
      <h1>Есть вопрос?<br />Есть ответ.</h1>
    </div>
    <details v-for="f in faq" :key="f.q">
      <summary>{{ f.q }}<span>+</span></summary>
      <p>{{ f.a }}</p>
    </details>
    <NuxtLink to="/map" class="button button-primary section"
      >Перейти к карте →</NuxtLink
    >
  </div>
</template>
