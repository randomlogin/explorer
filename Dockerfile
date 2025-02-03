FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env.example .env
RUN npm run build

FROM node:20-alpine
WORKDIR /app
# Copy built assets from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
# Install production dependencies only
RUN npm ci --production
# Expose the port your app runs on
EXPOSE 3000

# Use an entrypoint script to handle environment variables
CMD ["node", "build"]
