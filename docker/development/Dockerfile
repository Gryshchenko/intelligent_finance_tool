# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

RUN apk add --no-cache git
RUN corepack enable && corepack prepare pnpm@latest --activate

RUN mkdir -p /logs && chmod 777 /logs

WORKDIR /app
COPY . .


# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app
# Create directory for logs
RUN mkdir -p /var/mnt/local/logs && chown -R node:node /var/mnt/local

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY . .
ENV CI=true
RUN pnpm i
RUN pnpm install --config.confirmModulesPurge=true
RUN pnpm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

#COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=root /app/ ./

USER root

EXPOSE 3000

ENV PORT=3000

CMD ["pnpm", "run", "start"]

