# frontend/Dockerfile (production)
# 1. Build stage
FROM node:18 AS builder

WORKDIR /app
COPY . .

# Cài đặt dependencies
RUN npm install

# Build ứng dụng Next.js
RUN npm run build

# 2. Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only the output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "run", "start"]
