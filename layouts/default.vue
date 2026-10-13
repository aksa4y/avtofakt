<script setup lang="ts">
import { Zap, ArrowUpRight, Sun, Moon, Menu, X, MapPin } from 'lucide-vue-next'
import cyrillicFont from '@fontsource-variable/manrope/files/manrope-cyrillic-wght-normal.woff2?url'
import latinFont from '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2?url'
useHead({
  link: [cyrillicFont, latinFont].map((href) => ({
    rel: 'preload',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous',
    href,
  })),
})
const savedTheme = useCookie<'dark' | 'light'>('theme', {
  default: () => 'dark',
  sameSite: 'lax',
})
const theme = ref<'dark' | 'light'>('dark')
onMounted(() => {
  theme.value = savedTheme.value === 'light' ? 'light' : 'dark'
})
watch(theme, (value) => {
  savedTheme.value = value
})
const menu = ref(false)
const route = useRoute()
watch(
  () => route.path,
  () => {
    menu.value = false
  },
)
useHead(() => ({ htmlAttrs: { 'data-theme': theme.value } }))
const links = [
  { to: '/map', label: 'Карта зарядок' },
  { to: '/stations', label: 'Станции' },
  { to: '/calculator', label: 'Калькулятор' },
  { to: '/blog', label: 'Журнал' },
]
</script>
<template>
  <div>
    <a class="skip-link" href="#main">Перейти к содержимому</a>
    <header class="site-header">
      <div class="container header-inner">
        <NuxtLink to="/" class="brand" aria-label="Автофакт.by — главная"
          ><span class="brand-mark"><Zap :size="23" fill="currentColor" /></span
          >автофакт<span class="brand-by">.by</span></NuxtLink
        >
        <nav class="desktop-nav" aria-label="Основная навигация">
          <NuxtLink v-for="l in links" :key="l.to" :to="l.to">{{
            l.label
          }}</NuxtLink>
        </nav>
        <div class="header-actions">
          <span class="location"><MapPin :size="14" /> Беларусь</span
          ><button
            class="icon-button"
            :aria-label="
              theme === 'dark'
                ? 'Включить светлую тему'
                : 'Включить тёмную тему'
            "
            @click="theme = theme === 'dark' ? 'light' : 'dark'"
          >
            <Sun v-if="theme === 'dark'" :size="19" /><Moon
              v-else
              :size="19"
            /></button
          ><button
            class="icon-button mobile-menu"
            aria-label="Меню"
            :aria-expanded="menu"
            aria-controls="mobile-nav"
            @click="menu = !menu"
          >
            <X v-if="menu" /><Menu v-else />
          </button>
        </div>
      </div>
      <nav
        v-if="menu"
        id="mobile-nav"
        class="mobile-nav"
        aria-label="Мобильная навигация"
      >
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to">{{
          l.label
        }}</NuxtLink
        ><NuxtLink to="/contacts">Контакты</NuxtLink>
      </nav>
    </header>
    <main id="main"><slot /></main>
    <footer class="site-footer">
      <div class="container">
        <div class="footer-top">
          <div>
            <NuxtLink to="/" class="brand"
              ><span class="brand-mark"><Zap :size="22" /></span
              >автофакт.by</NuxtLink
            >
            <p>Меньше поисков.<br />Больше километров.</p>
          </div>
          <nav aria-label="Навигация в подвале">
            <NuxtLink to="/map">Карта зарядок</NuxtLink
            ><NuxtLink to="/stations">Каталог станций</NuxtLink
            ><NuxtLink to="/calculator">Калькулятор</NuxtLink>
          </nav>
          <nav aria-label="Информация">
            <NuxtLink to="/blog">Журнал</NuxtLink
            ><NuxtLink to="/faq">Вопросы и ответы</NuxtLink
            ><NuxtLink to="/contacts"
              >Контакты <ArrowUpRight :size="14"
            /></NuxtLink>
          </nav>
          <div class="footer-note">
            <span class="eyebrow">СДЕЛАНО ДЛЯ БЕЛАРУСИ</span>
            <p>Независимый путеводитель<br />по зарядной инфраструктуре.</p>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© {{ new Date().getFullYear() }} Автофакт</span
          ><span
            >Данные:
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              >© OpenStreetMap contributors · ODbL</a
            ></span
          ><NuxtLink to="/privacy">Конфиденциальность</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
