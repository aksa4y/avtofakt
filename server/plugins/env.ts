import { z } from 'zod'
export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()
  z.object({
    contactEmail: z.union([z.literal(''), z.email()]),
    reviewAdminToken: z.union([z.literal(''), z.string().min(32)]),
    public: z.object({ siteUrl: z.url() }),
  }).parse(config)
})
