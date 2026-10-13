<script setup lang="ts">
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-vue-next'
import { connectors } from '~/types/station'
import { cities } from '~/shared/cities'
const store = useFiltersStore()
defineProps<{ hideCity?: boolean }>()
</script>
<template>
  <div class="filters">
    <div class="search-field">
      <Search :size="19" /><label class="sr-only" for="station-search"
        >Название или адрес станции</label
      ><input
        id="station-search"
        v-model="store.q"
        type="search"
        placeholder="Город, адрес или название станции"
        autocomplete="off"
      />
    </div>
    <div class="filter-grid">
      <label v-if="!hideCity"
        >Город<select v-model="store.city">
          <option value="">Вся Беларусь</option>
          <option v-for="c in cities" :key="c.slug" :value="c.slug">
            {{ c.name }}
          </option>
        </select></label
      ><label
        >Разъём<select v-model="store.connector">
          <option value="">Все разъёмы</option>
          <option v-for="c in connectors" :key="c">{{ c }}</option>
        </select></label
      ><label
        >Мощность<select v-model.number="store.minPower">
          <option :value="0">Любая мощность</option>
          <option :value="22">От 22 кВт</option>
          <option :value="50">От 50 кВт</option>
          <option :value="100">От 100 кВт</option>
          <option :value="150">От 150 кВт</option>
        </select></label
      ><label
        >Оплата<select v-model="store.payment">
          <option value="">Любая</option>
          <option value="paid">Платная</option>
          <option value="free">Бесплатная</option>
          <option value="unknown">Не указана</option>
        </select></label
      ><label
        >Статус<select v-model="store.status">
          <option value="">Все станции</option>
          <option value="unknown">Нет live-данных</option>
          <option value="available">Свободна</option>
          <option value="busy">Занята</option>
          <option value="offline">Недоступна</option>
        </select></label
      ><button class="reset-button" @click="store.$reset()">
        <RotateCcw :size="16" /><span>Сбросить</span>
      </button>
    </div>
    <p class="filter-hint">
      <SlidersHorizontal :size="13" /> Фильтры учитывают только сведения,
      указанные в источнике.
    </p>
  </div>
</template>
