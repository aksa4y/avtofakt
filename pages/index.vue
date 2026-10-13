<script setup lang="ts">
import {
  ArrowUpRight,
  ArrowRight,
  Zap,
  MapPin,
  Plug,
  Route,
  ShieldCheck,
} from 'lucide-vue-next'
import { cities } from '~/shared/cities'
import { articles, faq } from '~/shared/content'
usePageSeo(
  'Зарядные станции в Минске и Беларуси — карта электрозарядок',
  'Найдите зарядную станцию в Минске и областях Беларуси. Карта, фильтры CCS, Type 2, CHAdeMO и GB/T, адреса и калькулятор стоимости зарядки.',
)
const { data: overview } = await useAsyncData('overview', () =>
  $fetch('/api/overview'),
)
const mapSection = ref<HTMLElement>()
const showMap = ref(false)
const { stop } = useIntersectionObserver(
  mapSection,
  ([entry]: IntersectionObserverEntry[]) => {
    if (entry?.isIntersecting) {
      showMap.value = true
      stop()
    }
  },
  { rootMargin: '200px' },
)
const LazyExplorer = defineLazyHydrationComponent(
  'visible',
  () => import('~/components/StationExplorer.vue'),
)
useSchemaOrg([defineWebSite({ name: 'Автофакт', inLanguage: 'ru-BY' })])
</script>
<template>
  <div>
    <section class="hero">
      <NuxtImg
        class="hero-image"
        src="/images/ev-hero.webp"
        width="1672"
        height="941"
        alt="Электромобиль у зарядной станции в тёмной студии"
        loading="eager"
        fetchpriority="high"
        densities="x1"
        preload
        format="webp"
      />
      <div class="hero-shade" />
      <div class="container hero-content">
        <div class="eyebrow">
          <span class="live-dot" /> ЭЛЕКТРОМОБИЛЬНОСТЬ В БЕЛАРУСИ
        </div>
        <h1>Твой маршрут.<br />Твоя <span>энергия.</span></h1>
        <p>
          Зарядные станции Минска и всей Беларуси.<br />Найди свою точку — и
          двигайся дальше.
        </p>
        <div class="hero-buttons">
          <NuxtLink class="button button-primary" to="/map"
            >Найти зарядку <ArrowUpRight :size="19" /></NuxtLink
          ><NuxtLink class="button button-glass" to="/calculator"
            >Рассчитать стоимость <ArrowRight :size="17"
          /></NuxtLink>
        </div>
        <div class="hero-benefits">
          <span><MapPin :size="17" /> Вся Беларусь</span
          ><span><Plug :size="17" /> Все типы разъёмов</span
          ><span><ShieldCheck :size="17" /> Открытые данные</span>
        </div>
      </div>
      <div class="hero-caption">
        ЭНЕРГИЯ ДЛЯ НОВЫХ ДОРОГ <span>01 / 03</span>
      </div>
    </section>
    <div class="container">
      <section class="stats-strip" aria-label="Каталог в цифрах">
        <div>
          <strong>{{ overview?.total || 0 }}</strong
          ><span>станций в каталоге</span>
        </div>
        <div>
          <strong>{{ overview?.byCity.minsk || 0 }}</strong
          ><span>станций в Минске</span>
        </div>
        <div><strong>6</strong><span>областных центров</span></div>
        <div><strong>4</strong><span>основных типа разъёмов</span></div>
      </section>
      <section class="section" aria-labelledby="map-heading">
        <div class="section-heading">
          <div>
            <span class="eyebrow">01 / ЗАРЯДКА РЯДОМ</span>
            <h2 id="map-heading">
              Точка на карте.<br /><span class="subtle">Продолжение пути.</span>
            </h2>
          </div>
          <NuxtLink to="/map" class="text-link"
            >Открыть большую карту <ArrowUpRight :size="18"
          /></NuxtLink>
        </div>
        <div ref="mapSection" class="home-map">
          <LazyExplorer v-if="showMap" :show-list="false" />
          <div v-else class="map-placeholder">
            <span class="map-loader" />Карта зарядных станций Беларуси<NuxtLink
              to="/map"
              class="text-link"
              >Открыть карту →</NuxtLink
            >
          </div>
        </div>
      </section>
      <section class="section featured-section">
        <div class="section-heading">
          <div>
            <span class="eyebrow">02 / ГОРОД НА ЭЛЕКТРИЧЕСТВЕ</span>
            <h2>Зарядные станции Минска</h2>
          </div>
          <NuxtLink to="/minsk" class="text-link"
            >Все станции <ArrowUpRight :size="18"
          /></NuxtLink>
        </div>
        <div class="station-grid">
          <StationCard
            v-for="s in overview?.featured || []"
            :key="s.id"
            :station="s"
          />
        </div>
      </section>
      <section class="section city-section">
        <div>
          <span class="eyebrow">ОТ МИНСКА ДО БРЕСТА</span>
          <h2>Дорога не заканчивается<br />за кольцевой.</h2>
          <p class="muted">
            Выбери город и найди зарядку поблизости.<br />Для повседневных
            поездок и больших путешествий.
          </p>
        </div>
        <div class="city-grid">
          <NuxtLink v-for="c in cities" :key="c.slug" :to="`/${c.slug}`"
            ><span
              >{{ c.name
              }}<small>{{ overview?.byCity[c.slug] || 0 }} станций</small></span
            ><ArrowUpRight :size="20"
          /></NuxtLink>
        </div>
      </section>
      <section class="journey-banner">
        <div>
          <span class="eyebrow">ПРОСТО ПОДКЛЮЧИСЬ</span>
          <h2>Меньше ожиданий.<br />Больше движения.</h2>
          <NuxtLink to="/faq" class="button button-primary"
            >Первая зарядка? Начни здесь <ArrowUpRight :size="18"
          /></NuxtLink>
        </div>
        <div class="journey-steps">
          <div>
            <span>01</span><Plug />
            <p>Выбери разъём<br /><small>Совместимый с твоим авто</small></p>
          </div>
          <div>
            <span>02</span><MapPin />
            <p>Найди станцию<br /><small>По пути или рядом с домом</small></p>
          </div>
          <div>
            <span>03</span><Route />
            <p>
              Отправляйся в путь<br /><small>Проверь статус у оператора</small>
            </p>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="section-heading">
          <div>
            <span class="eyebrow">03 / СЧИТАЕМ ЭНЕРГИЮ</span>
            <h2>Сколько стоит твой заряд?</h2>
          </div>
          <p class="muted">
            Понятный расчёт в белорусских рублях.<br />С учётом потерь и
            сравнением с ДВС.
          </p>
        </div>
        <ChargingCalculator />
      </section>
      <section class="section">
        <div class="section-heading">
          <div>
            <span class="eyebrow">ЖУРНАЛ АВТОФАКТ</span>
            <h2>На одной волне</h2>
          </div>
          <NuxtLink to="/blog" class="text-link"
            >Все материалы <ArrowUpRight :size="18"
          /></NuxtLink>
        </div>
        <div class="article-grid">
          <NuxtLink
            v-for="(a, i) in articles"
            :key="a.slug"
            :to="`/blog/${a.slug}`"
            class="article-card"
            ><div class="article-art" :class="`art-${i}`">
              <Plug v-if="i === 0" :size="70" :stroke-width="1" /><Zap
                v-else-if="i === 1"
                :size="76"
                :stroke-width="1"
              /><Route v-else :size="76" :stroke-width="1" /><span
                >0{{ i + 1 }}</span
              >
            </div>
            <div class="article-meta">
              {{ a.category }} <span>{{ a.minutes }} мин</span>
            </div>
            <h3>{{ a.title }}</h3>
            <span class="text-link">Читать <ArrowUpRight :size="17" /></span
          ></NuxtLink>
        </div>
      </section>
      <section class="section faq-section">
        <div>
          <span class="eyebrow">БЕЗ ЛИШНИХ ВОПРОСОВ</span>
          <h2>Всё начинается<br />с подключения.</h2>
          <NuxtLink to="/faq" class="text-link"
            >Все вопросы <ArrowUpRight :size="18"
          /></NuxtLink>
        </div>
        <div>
          <details v-for="f in faq.slice(0, 4)" :key="f.q">
            <summary>{{ f.q }}<span>+</span></summary>
            <p>{{ f.a }}</p>
          </details>
        </div>
      </section>
    </div>
  </div>
</template>
