FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
RUN pnpm rebuild esbuild sharp unrs-resolver && pnpm exec nuxt prepare && pnpm build
FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production NITRO_HOST=0.0.0.0 NITRO_PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app/.output ./.output
RUN mkdir -p /app/.data && chown node:node /app/.data
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", ".output/server/index.mjs"]
