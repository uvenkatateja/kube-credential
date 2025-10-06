FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json ./
RUN npm install

# Copy source code
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built application
COPY --from=build /app/dist ./dist
COPY package.json ./

# Install production dependencies
RUN npm install --production

# Environment variables
ENV PORT=3002
ENV DB_PATH=/data/verification.db

# Create data volume
VOLUME ["/data"]

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/index.js"]