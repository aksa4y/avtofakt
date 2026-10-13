import { createEnv } from '@t3-oss/env-nuxt'
import { z } from 'zod'
export const env = createEnv({
  server: {
    NUXT_REVIEW_ADMIN_TOKEN: z.string().min(32).optional(),
    NUXT_CONTACT_EMAIL: z.email().optional(),
    NUXT_TRUST_PROXY: z.enum(['true', 'false']).default('false'),
  },
  client: { NUXT_PUBLIC_SITE_URL: z.url().default('https://avtofakt.by') },
  emptyStringAsUndefined: true,
})
