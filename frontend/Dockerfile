# Build stage
FROM oven/bun:1.1 as builder

WORKDIR /app

COPY package*.json ./
RUN bun install

COPY . .
RUN bun run build --configuration production

# Serve stage
FROM nginx:alpine

# Copy the built files from the builder stage
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx/conf.d/prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 