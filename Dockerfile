# STAGE 1: Install dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
# Include the prisma folder so pnpm can see the schema if needed for postinstall
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile

# STAGE 2: Build the application
FROM node:22-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 1. Generate Prisma client (outputs to src/generated/prisma as per your schema)
# 2. Build Next.js (requires output: 'standalone' in next.config.ts)
RUN npx prisma generate && pnpm run build

# STAGE 3: Production runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Prisma 7: skip generation at runtime since we did it in builder
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy the standalone build artifacts
# This includes a minimal node_modules for the server to run
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# IMPORTANT: Copy your custom generated Prisma Client
# This ensures the files in src/generated/prisma are available to the standalone server
COPY --from=builder --chown=nextjs:nodejs /app/src/generated/prisma ./src/generated/prisma

# Copy the prisma directory (needed for schema and migrations at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use the standalone server.js entry point
CMD ["node", "server.js"]
