# ----------------------------
# Stage 1: Build
# ----------------------------

# Usa a imagem oficial do Node.js com base Alpine (mais leve) como ambiente de build
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependências (package.json e package-lock.json)
# Isso permite aproveitar o cache do Docker se as dependências não mudarem
COPY package*.json ./

# Instala apenas as dependências de produção (sem dependências de desenvolvimento)
RUN npm ci --omit=dev

# Copia o restante dos arquivos do projeto para o container
COPY . .

# Executa o processo de build (ex: Next.js, React, etc.)
RUN npm run build

# ----------------------------
# Stage 2: Runtime
# ----------------------------

# Usa novamente a imagem Node.js baseada em Alpine para criar a imagem final, enxuta
FROM node:18-alpine

# Define o diretório de trabalho dentro do container de produção
WORKDIR /app

# Instala o Tini, um init system leve que ajuda a tratar sinais corretamente dentro do container
RUN apk add --no-cache tini

# Copia apenas a pasta de build gerada pelo estágio anterior
COPY --from=builder /app/.next ./.next

# Copia os arquivos estáticos do projeto (ex: imagens, favicon, etc.)
COPY --from=builder /app/public ./public

# Copia o package.json para que o npm saiba as dependências em runtime
COPY --from=builder /app/package.json ./package.json

# Copia a pasta `node_modules` contendo as dependências instaladas
COPY --from=builder /app/node_modules ./node_modules

# Cria um novo grupo e usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && adduser -S -u 1001 nextjs -G nodejs

# Define que a aplicação será executada pelo usuário não-root criado acima
USER nextjs

# Expõe a porta 3000 (utilizada pela aplicação Node.js)
EXPOSE 3000

# Define uma verificação de saúde (healthcheck) para o container
# Isso faz um "ping" HTTP a cada 30s para garantir que o app está rodando
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Define o Tini como init system, evitando problemas de reaper de processos zumbis
ENTRYPOINT ["/sbin/tini", "--"]

# Comando padrão ao iniciar o container: inicia o servidor da aplicação
CMD ["npm", "start"]
