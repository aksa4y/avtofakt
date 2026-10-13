export function usePageSeo(title: string, description: string, path?: string) {
  const route = useRoute()
  const site = useRuntimeConfig().public.siteUrl
  const canonical = computed(() => `${site}${path ?? route.path}`)
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    ogLocale: 'ru_BY',
    ogSiteName: 'Автофакт',
    ogUrl: canonical,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
  })
  useHead(() => ({
    link: [
      { rel: 'canonical', href: canonical.value },
      { rel: 'alternate', hreflang: 'ru-BY', href: canonical.value },
      { rel: 'alternate', hreflang: 'x-default', href: canonical.value },
    ],
  }))
  defineOgImage('Avtofakt.satori', { title, description })
}
