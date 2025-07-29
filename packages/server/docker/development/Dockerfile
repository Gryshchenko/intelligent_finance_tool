# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

RUN apk add --no-cache git

WORKDIR /app
COPY . .
RUN echo "Step 0 done" && ls -la /app


# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN echo "Step 1 done" && ls -la /app

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY . .
ENV CI=true
RUN npm i
RUN npm install --config.confirmModulesPurge=true
RUN npm run build:dev
RUN echo "Step 2 done" && ls -la /app

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app


RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

RUN chown -R nextjs:nodejs /app

#COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
RUN echo "Step 3.0 done" && ls -la /app
COPY --from=builder --chown=nextjs:nodejs /app/ ./
RUN echo "Step 3 done" && ls -la /app


USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "run", "start"]

