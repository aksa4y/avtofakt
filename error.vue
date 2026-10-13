<script setup lang="ts">
import type { NuxtError } from '#app'
import { Zap, ArrowRight } from 'lucide-vue-next'
const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)
useSeoMeta({
  title: () =>
    notFound.value
      ? 'Страница не найдена · Автофакт'
      : 'Временная ошибка · Автофакт',
  robots: 'noindex, nofollow',
})
</script>
<template>
  <NuxtLayout
    ><div class="error-page container">
      <div class="error-orbit"><Zap :size="90" :stroke-width="1" /></div>
      <span class="eyebrow">{{ error.statusCode }} / СВЯЗЬ ПРЕРВАНА</span>
      <h1>
        {{
          notFound
            ? 'Кажется, здесь нет зарядки.'
            : 'Нужна короткая подзарядка.'
        }}
      </h1>
      <p>
        {{
          notFound
            ? 'Эта страница уехала. Но подходящая станция точно найдётся.'
            : 'Сервис временно недоступен. Попробуйте вернуться через минуту.'
        }}
      </p>
      <button
        class="button button-primary"
        @click="clearError({ redirect: '/' })"
      >
        На главную <ArrowRight :size="18" /></button
      ><NuxtLink
        to="/map"
        class="text-link"
        @click.prevent="clearError({ redirect: '/map' })"
        >Открыть карту</NuxtLink
      >
    </div></NuxtLayout
  >
</template>
