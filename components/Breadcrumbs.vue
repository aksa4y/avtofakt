<script setup lang="ts">
const props = defineProps<{ items: { label: string; to?: string }[] }>()
const all = computed(() => [{ label: 'Главная', to: '/' }, ...props.items])
useSchemaOrg([
  defineBreadcrumb({
    itemListElement: all.value.map((i) => ({
      name: i.label,
      item: i.to || useRoute().path,
    })),
  }),
])
</script>
<template>
  <nav class="breadcrumbs" aria-label="Хлебные крошки">
    <ol>
      <li v-for="(i, n) in all" :key="n">
        <span v-if="n" class="separator" aria-hidden="true">/</span
        ><NuxtLink v-if="i.to && n !== all.length - 1" :to="i.to">{{
          i.label
        }}</NuxtLink
        ><span v-else aria-current="page">{{ i.label }}</span>
      </li>
    </ol>
  </nav>
</template>
