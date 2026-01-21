# ======================
# Test
# ======================
FROM node:20-alpine AS test

RUN apk add --no-cache git
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY packages/server/package.json ./packages/server/

COPY packages/server/tsconfig.json ./packages/server/
COPY packages/server/jest.config.js ./packages/server/
COPY packages/server/jest.setup.ts ./packages/server/
COPY packages/server/src ./packages/server/src
COPY packages/server/tests ./packages/server/tests
COPY packages/shared ./packages/shared

RUN  echo "test" && ls -la

RUN corepack enable && corepack prepare pnpm@9 --activate
RUN pnpm --filter tenpercent/shared build || true
RUN pnpm install

WORKDIR /app/packages/server
CMD ["pnpm", "run", "jest-test"]
