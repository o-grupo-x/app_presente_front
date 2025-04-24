# ====== Stage 1: Build ======
FROM node:18-alpine AS builder

WORKDIR /app

# Copia e instala dependências
COPY package*.json ./
RUN npm ci

# Copia o restante do projeto e gera o build
COPY . .
RUN npm run build

# ====== Stage 2: Runtime ======
FROM node:18-alpine AS runner

WORKDIR /app

# Usa tini já embutido na imagem do node
ENTRYPOINT ["tini", "--"]

# Copia apenas os arquivos finais necessários
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/node_modules ./node_modules

# Cria usuário seguro
RUN addgroup -g 1001 -S nodejs && adduser -S -u 1001 nextjs -G nodejs
USER nextjs

EXPOSE 3000

# Healthcheck opcional
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Comando de inicialização
CMD ["npm", "start"]
