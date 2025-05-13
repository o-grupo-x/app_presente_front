# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Instala dependências de produção
COPY package*.json ./
RUN npm ci --omit=dev

# Copia o restante do projeto
COPY . .

# Gera a build de produção do Next.js
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

ARG build_time
LABEL build_time=$build_time

WORKDIR /app

# Instala tini para gerenciamento de processos
RUN apk add --no-cache tini

# Copia arquivos necessários da etapa de build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 👇️ Cópias essenciais para funcionamento do Next.js com SSR
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/app ./app          # Caso use App Router (Next 13+)
COPY --from=builder /app/styles ./styles    # Opcional, caso exista
COPY --from=builder /app/middleware.js ./middleware.js  # Se usar middleware

# Define usuário não-root para execução segura
RUN addgroup -g 1001 -S nodejs && adduser -S -u 1001 nextjs -G nodejs
USER nextjs

EXPOSE 3000

# Healthcheck opcional
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "start"]
