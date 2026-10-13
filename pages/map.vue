<script setup lang="ts">
usePageSeo(
  'Карта зарядных станций Беларуси',
  'Интерактивная карта зарядок Беларуси: Минск, Брест, Гродно, Витебск, Гомель, Могилёв. Разъёмы, мощность и геолокация.',
)
</script>
<template>
  <div class="container page">
    <Breadcrumbs :items="[{ label: 'Карта зарядок' }]" />
    <div class="page-heading">
      <span class="eyebrow">БЕЛАРУСЬ НА ЭЛЕКТРИЧЕСТВЕ</span>
      <h1>Зарядка по пути.</h1>
      <p>
        Выбирайте разъём и мощность. Перед поездкой проверяйте доступность у
        оператора.
      </p>
    </div>
    <StationExplorer full-map />
  </div>
</template>
