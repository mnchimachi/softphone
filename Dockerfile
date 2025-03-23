FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/gateway ./src/gateway

# Expose ports
EXPOSE 3002 8082 5060/udp 10000-10010/udp

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002
ENV VITE_APP_PORT=8082

# Start the application
CMD ["npm", "run", "start"]