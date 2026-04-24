FROM oven/bun:1.3.5-alpine

# Set working directory to the monorepo root
WORKDIR /app

# Copy monorepo root config files
COPY package.json bun.lock bunfig.toml turbo.json ./

# Copy only necessary package.json files to install workspace dependencies
COPY packages/db/ ./packages/db/
COPY tooling/typescript/ ./tooling/typescript/
COPY tooling/tsdown/ ./tooling/tsdown/

# Install dependencies with Bun
RUN bun install --frozen-lockfile

# Set working directory to the app
WORKDIR /app/packages/db

CMD ["bun", "run", "db:start"]
