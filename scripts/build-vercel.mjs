import { rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

// Nitro's prerenderer must not serve HTML from a previous Node or Vercel build.
for (const directory of ['.output', '.vercel/output'])
  rmSync(directory, { recursive: true, force: true })

const result = spawnSync(
  process.execPath,
  ['node_modules/nuxt/bin/nuxt.mjs', 'build'],
  {
    env: { ...process.env, NITRO_PRESET: 'vercel' },
    stdio: 'inherit',
  },
)
if (result.error) throw result.error
process.exit(result.status ?? 1)
