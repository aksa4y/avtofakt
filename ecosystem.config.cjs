module.exports = {
  apps: [
    {
      name: 'avtofakt',
      script: './.output/server/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '750M',
      time: true,
      env: {
        NODE_ENV: 'production',
        NITRO_HOST: '127.0.0.1',
        NITRO_PORT: '3000',
        NUXT_TRUST_PROXY: 'true',
        NUXT_PUBLIC_SITE_URL: 'https://avtofakt.by',
      },
    },
  ],
}
