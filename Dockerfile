# ===== Stage 1: Build Next.js =====
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Env untuk build time
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_BASE_URL=https://api-college.youthmultiply.com
ENV NEXT_PUBLIC_ASSET_PREFIX=https://college.youthmultiply.com/

# Install dependencies (gunakan cache Docker untuk optimasi)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Hardcode assetPrefix ke https://college.youthmultiply.com
RUN sed -i "s|process.env.NEXT_PUBLIC_ASSET_PREFIX.*| 'https://college.youthmultiply.com',|" next.config.* || true

# Build Next.js
RUN npm run build

# ===== Stage 2: Production Runner =====
FROM node:20-alpine AS runner
WORKDIR /app

# Env untuk runtime (hardcode)
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_BASE_URL=https://api-college.youthmultiply.com
ENV NEXT_PUBLIC_ASSET_PREFIX=https://college.youthmultiply.com/

# Install only production dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy built app & files dari builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.* ./

# Expose port
EXPOSE 3000

# Jalankan Next.js di mode production
CMD ["npm", "start"]
