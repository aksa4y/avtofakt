<script setup lang="ts">
import { Star } from 'lucide-vue-next'
import type { ReviewsResponse } from '~/types/review'
const props = defineProps<{ slug: string }>()
const { data, error, refresh } = await useAsyncData(
  `reviews-${props.slug}`,
  () => $fetch<ReviewsResponse>(`/api/stations/${props.slug}/reviews`),
)
const { data: settings } = await useFetch<{
  email: string | null
  reviewsEnabled: boolean
}>('/api/contact')
onMounted(() => {
  void refresh()
})
const form = reactive({ name: '', rating: 5, text: '', website: '' })
const pending = ref(false)
const message = ref('')
const sent = ref(false)
async function submit() {
  pending.value = true
  message.value = ''
  try {
    const result = await $fetch<{ message: string }>(
      `/api/stations/${props.slug}/reviews`,
      { method: 'POST', body: form },
    )
    message.value = result.message
    sent.value = true
  } catch {
    message.value =
      'Не удалось отправить отзыв. Проверьте поля или повторите позже (не чаще трёх раз в час).'
  } finally {
    pending.value = false
  }
}
</script>
<template>
  <section class="detail-card">
    <h2>
      Отзывы водителей
      <span v-if="data?.rating" class="review-rating"
        >★ {{ data.rating.toFixed(1) }} / 5</span
      >
    </h2>
    <p v-if="error" role="status">
      Отзывы временно недоступны. Попробуйте открыть страницу позже.
    </p>
    <div v-else-if="!data?.count" class="reviews-empty">
      <Star :size="28" />
      <h3>Пока нет отзывов</h3>
      <p>Рейтинг появится вместе с первыми опубликованными отзывами.</p>
    </div>
    <article v-for="r in data?.reviews" :key="r.id" class="review">
      <div>
        <strong>{{ r.name }}</strong
        ><span :aria-label="`Оценка ${r.rating} из 5`">★ {{ r.rating }}/5</span>
      </div>
      <p>{{ r.text }}</p>
      <time :datetime="r.createdAt">{{
        new Date(r.createdAt).toLocaleDateString('ru-BY')
      }}</time>
    </article>
    <form
      v-if="settings?.reviewsEnabled && !sent"
      class="review-form"
      @submit.prevent="submit"
    >
      <h3>Поделитесь опытом</h3>
      <label
        >Ваше имя<input
          v-model="form.name"
          required
          minlength="2"
          maxlength="60"
          autocomplete="given-name" /></label
      ><label
        >Оценка<select v-model.number="form.rating">
          <option v-for="n in 5" :key="n" :value="n">{{ n }} / 5</option>
        </select></label
      ><label
        >Что стоит знать другим водителям?<textarea
          v-model="form.text"
          required
          minlength="20"
          maxlength="2000"
          rows="4"
          placeholder="Как прошла зарядка, удобно ли подъехать…"
        /></label
      ><label class="honeypot" aria-hidden="true"
        >Website<input v-model="form.website" tabindex="-1" autocomplete="off"
      /></label>
      <p class="data-note">
        Имя и текст будут общедоступны после модерации. Не указывайте телефон и
        другие личные данные.
      </p>
      <button class="button button-primary" :disabled="pending">
        {{ pending ? 'Отправляем…' : 'Отправить отзыв' }}
      </button>
    </form>
    <p v-else-if="!settings?.reviewsEnabled" class="data-note">
      Приём отзывов откроется после подключения модерации.
    </p>
    <p v-if="message" class="review-message" role="status">{{ message }}</p>
  </section>
</template>
