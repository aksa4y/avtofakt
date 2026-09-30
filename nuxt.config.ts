export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@nuxtjs/seo'],
  css: ['~/assets/css/main.css'],
  typescript: { strict: true, typeCheck: true },
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      meta: [
        { name: 'theme-color', content: '#0b0d10' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      ],
    },
  },
  site: {
    url: 'https://avtofakt.by',
    name: 'Автофакт — СТО Минска',
    description: 'Проверенные автосервисы Минска: услуги, цены, адреса и телефоны.',
  },
  routeRules: {
    '/api/stations': { cors: true, cache: { maxAge: 60, swr: true } },
    '/services/**': { prerender: true },
    '/districts/**': { prerender: true },
  },
  robots: { disallow: ['/api/'] },
  sitemap: {
    urls: [
      '/services/remont', '/services/diagnostika', '/services/shinomontazh', '/services/autoelektrika',
      '/districts/center', '/districts/frunzensky', '/districts/partizansky', '/districts/moskovsky',
    ],
  },
  tailwindcss: { config: { theme: { extend: { colors: {
    ink: '#0b0d10', panel: '#111419', raised: '#181c22', line: '#292e36', muted: '#9aa3af',
    lime: '#c5f36b', amber: '#f5b942', danger: '#ff7777', success: '#78dba2',
  } } } } },
})
