# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm ci --omit=dev

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app
# Use a specific Alpine repository mirror
RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.18/main" > /etc/apk/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/v3.18/community" >> /etc/apk/repositories && \
    apk update && apk add --no-cache tini
# Copy necessary artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/node_modules ./node_modules
# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S -u 1001 nextjs -G nodejs
USER nextjs
# Expose port
EXPOSE 3000
# Healthcheck for Kubernetes
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1
# Entrypoint and command
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "start"]