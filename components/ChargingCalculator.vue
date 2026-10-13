<script setup lang="ts">
import { ArrowUpRight, Zap } from 'lucide-vue-next'
import { calculate } from '~/utils/calculator'
const values = reactive({
  battery: 60,
  from: 20,
  to: 80,
  tariff: 0.65,
  loss: 10,
  consumption: 18,
  petrolConsumption: 8,
  petrolPrice: 2.6,
})
const result = computed(() => calculate(values))
const money = (n: number) =>
  n.toLocaleString('ru-BY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
const inputs = [
  {
    key: 'battery',
    label: 'Ёмкость батареи, кВт·ч',
    min: 1,
    max: 300,
    step: 1,
  },
  {
    key: 'tariff',
    label: 'Ваш тариф, BYN / кВт·ч',
    min: 0,
    max: 100,
    step: 0.01,
  },
  { key: 'from', label: 'Заряд сейчас, %', min: 0, max: 99, step: 1 },
  { key: 'to', label: 'Заряд до, %', min: 1, max: 100, step: 1 },
  { key: 'loss', label: 'Потери зарядки, %', min: 0, max: 50, step: 1 },
  {
    key: 'consumption',
    label: 'Расход EV, кВт·ч / 100 км',
    min: 1,
    max: 100,
    step: 0.1,
  },
  {
    key: 'petrolConsumption',
    label: 'Расход ДВС, л / 100 км',
    min: 1,
    max: 50,
    step: 0.1,
  },
  {
    key: 'petrolPrice',
    label: 'Цена бензина, BYN / л',
    min: 0,
    max: 100,
    step: 0.01,
  },
] as const
</script>
<template>
  <div class="calculator">
    <form class="calculator-fields" @submit.prevent>
      <label v-for="f in inputs" :key="f.key"
        >{{ f.label
        }}<input
          v-model.number="values[f.key]"
          type="number"
          :min="f.min"
          :max="f.max"
          :step="f.step"
          required
      /></label>
      <p class="muted calculator-caption">
        Начальные цены — пример расчёта, не действующие тарифы. Укажите свои
        значения.
      </p>
    </form>
    <div class="calculator-result" aria-live="polite">
      <template v-if="result"
        ><span class="eyebrow"><Zap :size="15" /> СТОИМОСТЬ СЕССИИ</span>
        <p class="big-price">{{ money(result.cost) }}<span>BYN</span></p>
        <p>{{ money(result.energy) }} кВт·ч из сети, с учётом потерь</p>
        <div class="comparison">
          <div>
            <span>Электромобиль / 100 км</span
            ><strong>{{ money(result.electric100) }} BYN</strong>
          </div>
          <div>
            <span>Бензиновый авто / 100 км</span
            ><strong>{{ money(result.petrol100) }} BYN</strong>
          </div>
          <div>
            <span>{{
              result.savings >= 0 ? 'Экономия на 100 км' : 'Переплата на 100 км'
            }}</span
            ><strong>{{ money(Math.abs(result.savings)) }} BYN</strong>
          </div>
        </div>
        <NuxtLink to="/map" class="button button-dark"
          >Найти зарядку <ArrowUpRight :size="18" /></NuxtLink
      ></template>
      <p v-else role="alert">
        Проверьте значения: целевой заряд должен быть выше начального, а все
        поля — заполнены корректно.
      </p>
    </div>
  </div>
</template>
