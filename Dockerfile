# ====== Stage 1: Build ======
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm ci --omit=dev

# ====== Stage 2: Runtime ======
FROM node:18-alpine AS runner
WORKDIR /app
ENTRYPOINT ["tini", "--"]
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/node_modules ./node_modules
RUN addgroup -g 1001 -S nodejs && adduser -S -u 1001 nextjs -G nodejs
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1
CMD ["npm", "start"]