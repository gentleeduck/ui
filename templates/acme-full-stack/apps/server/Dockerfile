# syntax=docker/dockerfile:1
FROM oven/bun:1.3.11-alpine AS build
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile
RUN bun run --filter=@acme/server build

FROM oven/bun:1.3.11-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/server/dist ./dist
COPY --from=build /app/apps/server/package.json ./package.json
EXPOSE 3000
CMD ["bun", "run", "dist/main.js"]
