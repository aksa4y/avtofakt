<script setup lang="ts">
usePageSeo(
  'Контакты Автофакт — карта зарядок Беларуси',
  'Связь с проектом Автофакт, источники данных и порядок исправления информации о зарядных станциях Беларуси.',
)
const { data: contact } = await useFetch<{ email: string | null }>(
  '/api/contact',
)
const { data } = await useStations()
useSchemaOrg([{ '@type': 'ContactPage', name: 'Контакты Автофакт' }])
</script>
<template>
  <div class="container page">
    <Breadcrumbs :items="[{ label: 'Контакты' }]" />
    <div class="page-heading">
      <span class="eyebrow">ДАВАЙТЕ НА СВЯЗИ</span>
      <h1>Хорошая карта<br />начинается с людей.</h1>
      <p>
        Автофакт — независимый информационный проект о зарядной инфраструктуре
        Беларуси.
      </p>
    </div>
    <div class="detail-grid">
      <section class="detail-card prose">
        <h2>Связаться с редакцией</h2>
        <p v-if="contact?.email">
          <a class="text-link" :href="`mailto:${contact.email}`">{{
            contact.email
          }}</a>
        </p>
        <p v-else>Контактный адрес редакции пока не опубликован.</p>
        <h2>Исправить данные станции</h2>
        <p>
          Откройте карточку станции и перейдите по ссылке на OpenStreetMap. Там
          можно сообщить об ошибке или обновить сведения.
        </p>
        <h2>Наша география</h2>
        <p>
          Минск и Республика Беларусь. У проекта нет опубликованного офиса для
          приёма посетителей. На карте показаны зарядные станции, а не офис
          редакции.
        </p>
        <NuxtLink to="/stations" class="text-link">Открыть каталог →</NuxtLink>
      </section>
      <MapView :stations="data?.stations || []" />
    </div>
  </div>
</template>
