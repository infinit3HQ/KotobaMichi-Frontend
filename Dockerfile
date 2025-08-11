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

# 2) Runtime stage: serve static files with Nginx
FROM nginx:1.27-alpine AS runner

# Remove default config and add our SPA-friendly one
RUN rm -f /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Install curl for healthcheck and troubleshooting
RUN apk add --no-cache curl

# Healthcheck for Nginx
HEALTHCHECK --interval=30s --timeout=3s CMD curl -fsS http://127.0.0.1/ || exit 1

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
