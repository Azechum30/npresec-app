FROM node:18-alpine AS base

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install 

COPY . .

RUN pnpm run build

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=base /app/package.json /app/pnpm-lock.yaml ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma

RUN pnpm install -g prisma
RUN pnpm exec prisma generate

EXPOSE 3001

CMD ["npm", "start"]



