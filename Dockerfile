# Use Node 24 Alpine as base image
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json AND tsconfig.json first
COPY package*.json tsconfig.json ./

# Install ALL dependencies (dev + prod)
RUN npm install

# Copy rest of the source code
COPY . .

# Build the Next.js app
RUN npm run build

# Next stage: production image
FROM node:24-alpine AS runner

WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
