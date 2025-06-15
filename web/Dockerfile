# Stage 1: Build the Next.js application
# Utiliza una imagen Node.js LTS basada en Alpine para un tamaño de imagen más pequeño.
FROM node:20-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de dependencias (package.json, yarn.lock, etc.)
# Esto permite que Docker cachee esta capa si las dependencias no cambian.
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

