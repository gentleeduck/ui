# syntax=docker/dockerfile:1
FROM oven/bun:1.3.11-alpine
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile
WORKDIR /app/packages/db
EXPOSE 4983
CMD ["bunx", "drizzle-kit", "studio", "--host", "0.0.0.0", "--port", "4983"]
