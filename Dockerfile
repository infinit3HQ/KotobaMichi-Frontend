# Multi-stage build for Vite React app
# 1) Build stage: install deps and build static assets
FROM node:20-alpine AS builder

# Enable corepack and pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Install dependencies using cached layers
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
# Allow passing Vite env vars at build time (e.g., --build-arg VITE_API_URL=https://api.example.com)
ARG VITE_API_URL
ARG VITE_APP_ENV
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_ENV=${VITE_APP_ENV}
RUN pnpm build

# 2) Runtime stage: run SSR server with Node (Nitro output)
FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# Copy Nitro/TanStack Start output (client assets live in .output/public, server in .output/server)
COPY --from=builder /app/.output /app/.output

# Install only server runtime deps defined by Nitro in .output/server/package.json
WORKDIR /app/.output/server
RUN npm i --omit=dev --no-audit --no-fund

# Optional tools for healthcheck/troubleshooting
RUN apk add --no-cache curl

# Healthcheck for Node server (default listens on PORT or 3000)
ENV PORT=3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD curl -fsS http://127.0.0.1:${PORT}/ || exit 1

EXPOSE 3000
CMD ["node", "index.mjs"]
