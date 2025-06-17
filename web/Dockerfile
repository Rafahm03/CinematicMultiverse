
FROM node:20-alpine AS builder

WORKDIR /app


COPY package.json yarn.lock* package-lock.json* ./


RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else npm install; fi

COPY . .


RUN npm run build


FROM node:20-alpine AS runner

ENV NODE_ENV production

WORKDIR /app


COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000


CMD ["node", "server.js"]

