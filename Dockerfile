# ========================
# Stage 1: Builder
# ========================
FROM node:18-alpine AS builder

WORKDIR /app

# Instala dependências de produção + dev
COPY package*.json ./
RUN npm ci

# Copia o restante do projeto
COPY . .

# Builda o projeto Next.js
RUN npm run build

# Remove dependências de desenvolvimento
RUN npm prune --production

# ========================
# Stage 2: Final Image
# ========================
FROM node:18-alpine AS runner

WORKDIR /app

# Instala tini para gerenciamento de processos
RUN apk add --no-cache tini

# Copia apenas os arquivos necessários da build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/node_modules ./node_modules

# Cria usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S -u 1001 nextjs -G nodejs
USER nextjs

EXPOSE 3000

# Healthcheck para Kubernetes
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Entrypoint e start
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node_modules/.bin/next", "start"]
