import { env } from './env'
import { cities } from './shared/cities'
import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/seo',
    '@nuxt/eslint',
  ],
  vite: { plugins: [tailwindcss()] },
  css: ['@fontsource-variable/manrope', '~/assets/css/main.css'],
  typescript: { strict: true },
  hooks: {
    'pages:extend'(pages) {
      const index = pages.findIndex((page) =>
        page.file?.endsWith('/[city].vue'),
      )
      const template = index >= 0 ? pages.splice(index, 1)[0] : undefined
      if (template)
        for (const city of cities)
          pages.push({
            ...template,
            name: `city-${city.slug}`,
            path: `/${city.slug}`,
          })
    },
  },
  site: {
    url: env.NUXT_PUBLIC_SITE_URL,
    name: 'Автофакт',
    description:
      'Карта зарядных станций для электромобилей в Минске и Беларуси',
    defaultLocale: 'ru-BY',
  },
  app: {
    head: {
      htmlAttrs: { lang: 'ru-BY' },
      titleTemplate: '%s · Автофакт',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      meta: [{ name: 'theme-color', content: '#090d0b' }],
    },
  },
  runtimeConfig: {
    reviewAdminToken: env.NUXT_REVIEW_ADMIN_TOKEN || '',
    contactEmail: env.NUXT_CONTACT_EMAIL || '',
    trustProxy: env.NUXT_TRUST_PROXY === 'true',
    public: { siteUrl: env.NUXT_PUBLIC_SITE_URL },
  },
  nitro: {
    preset: 'node-server',
    storage: { reviews: { driver: 'fs', base: './.data/reviews' } },
    compressPublicAssets: true,
    prerender: { crawlLinks: false },
  },
  routeRules: {
    '/': { prerender: true },
    ...Object.fromEntries(
      cities.map((city) => [`/${city.slug}`, { prerender: true }]),
    ),
    '/index.php': { redirect: { to: '/', statusCode: 301 } },
    '/stations/**': { swr: 3600 },
    '/blog/**': { swr: 3600 },
    '/api/stations': { cors: true, swr: 3600 },
    '/images/**': { headers: { 'cache-control': 'public, max-age=604800' } },
    '/_nuxt/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
  },
  // Nuxt 3 uses Unhead 2; the Unhead 3-only optimization is not applicable.
  seo: { treeShakeUseSeoMeta: false },
  // Build-time checks request the current production domain for SSR routes.
  // Validate all internal anchors against the new Node build in smoke.mjs instead.
  linkChecker: { runOnBuild: false },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    urls: cities.map((city) => ({ loc: `/${city.slug}` })),
  },
  robots: {
    groups: [
      {
        userAgent: [
          '*',
          'Googlebot',
          'Yandex',
          'Bingbot',
          'GPTBot',
          'ClaudeBot',
          'PerplexityBot',
        ],
        allow: '/',
      },
    ],
  },
  fonts: {
    providers: {
      google: false,
      bunny: false,
      fontshare: false,
      fontsource: false,
      adobe: false,
    },
    families: [
      {
        name: 'Avtofakt Sans',
        src: '/fonts/Inter-400.ttf',
        weight: 400,
        global: true,
      },
      {
        name: 'Avtofakt Sans',
        src: '/fonts/Inter-700.ttf',
        weight: 700,
        global: true,
      },
    ],
  },
  ogImage: { defaults: { width: 1200, height: 630 } },
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Автофакт',
      url: env.NUXT_PUBLIC_SITE_URL,
      logo: '/favicon.svg',
    },
  },
  image: { format: ['webp', 'avif'] },
  features: { inlineStyles: true },
})
