<script setup lang="ts">
import { articles } from '~/shared/content'
const route = useRoute()
const a = articles.find((a) => a.slug === route.params.slug)
if (!a)
  throw createError({ statusCode: 404, statusMessage: 'Статья не найдена' })
usePageSeo(a.title, a.intro)
useSeoMeta({
  ogType: 'article',
  articlePublishedTime: a.date,
  articleModifiedTime: a.date,
})
useSchemaOrg([
  defineArticle({
    headline: a.title,
    description: a.intro,
    datePublished: a.date,
    dateModified: a.date,
    author: { '@type': 'Organization', name: 'Редакция Автофакт' },
    image: `${useRuntimeConfig().public.siteUrl}/images/ev-hero.webp`,
  }),
])
</script>
<template>
  <article class="container page narrow">
    <Breadcrumbs
      :items="[{ label: 'Журнал', to: '/blog' }, { label: a.title }]"
    />
    <header class="page-heading">
      <span class="eyebrow">{{ a.category }} · {{ a.minutes }} МИНУТ</span>
      <h1>{{ a.title }}</h1>
      <p>{{ a.intro }}</p>
      <p class="article-meta">
        <time :datetime="a.date">{{
          new Date(a.date).toLocaleDateString('ru-BY')
        }}</time>
        · Редакция Автофакт
      </p>
    </header>
    <div class="prose">
      <section v-for="s in a.sections" :key="s.title">
        <h2>{{ s.title }}</h2>
        <p>{{ s.text }}</p>
      </section>
      <p class="data-note">
        Материал носит справочный характер. Совместимость оборудования уточняйте
        у производителя автомобиля, действующие цены — у оператора станции.
      </p>
    </div>
    <aside class="article-cta">
      <h2>Проверьте на практике</h2>
      <NuxtLink to="/map" class="button button-primary"
        >Найти зарядную станцию →</NuxtLink
      ><NuxtLink to="/calculator" class="text-link"
        >Рассчитать стоимость</NuxtLink
      >
    </aside>
  </article>
</template>
