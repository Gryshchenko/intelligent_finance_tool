# ======================
# Production
# ======================
# Two independent installs off the same base: `build` gets the full dev
# toolchain to compile TypeScript, `prod-deps` resolves runtime dependencies
# only. The runtime image copies the result of both, so neither the compiler
# nor the native build toolchain ships to production.

FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.5.3 --activate
WORKDIR /app

# ----------------------
# Build: shared -> server
# ----------------------
FROM base AS build
# argon2 is a native module and has no musl prebuild
RUN apk add --no-cache python3 make g++

# 1. Workspace root manifests + lockfile
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# 2. package.json for ALL workspace packages (pnpm needs the full graph)
COPY packages/app/package.json ./packages/app/
COPY packages/server/package.json ./packages/server/
COPY packages/shared/package.json ./packages/shared/

# 3. Install server + shared deps (skip the heavy app package)
RUN pnpm install --frozen-lockfile --filter "@tenpercent/server..."

# 4. Build shared, then compile the server against it
COPY packages/shared ./packages/shared
RUN pnpm --filter "@tenpercent/shared" build

COPY packages/server/tsconfig.json packages/server/tsconfig.build.json packages/server/types.d.ts ./packages/server/
COPY packages/server/src ./packages/server/src
RUN pnpm --filter "@tenpercent/server" run build

# 5. Runtime dependencies. `nodeLinker: hoisted` makes a filtered install lay
# down the whole workspace (Expo, React Native, test tooling) in one
# node_modules, so the build's node_modules can't be shipped as is. `deploy`
# instead resolves the server's production graph alone from the lockfile into
# a standalone directory, with shared copied in as a regular package (its
# "files" limits that copy to dist). argon2 is compiled here, where the
# toolchain already is.
RUN pnpm --filter "@tenpercent/server" --config.inject-workspace-packages=true deploy --prod /deploy

# ----------------------
# Runtime
# ----------------------
FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY --chown=node:node docker/prod/rds-global-bundle.pem /app/certs/rds-global-bundle.pem
ENV NODE_EXTRA_CA_CERTS=/app/certs/rds-global-bundle.pem

COPY --from=build --chown=node:node /deploy/package.json ./package.json
COPY --from=build --chown=node:node /deploy/node_modules ./node_modules
COPY --from=build --chown=node:node /app/packages/server/dist ./dist
# Served by app.ts from process.cwd()/public
COPY --chown=node:node packages/server/public ./public

USER node
EXPOSE 3000
CMD ["node", "dist/src/app.js"]
