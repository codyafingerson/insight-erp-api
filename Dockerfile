# --- Builder Stage ---
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./
COPY prisma/schema.prisma ./prisma/

# Install ALL dependencies (including devDependencies)
RUN bun install

# Copy the rest of the application code
COPY . .

# Build the application (transpile TypeScript, etc.)
RUN bun run build

# --- Production Stage ---
FROM oven/bun:1 AS production
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Copy only the necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Ensure /app is writable by the bun user (including the logs folder that will be created)
RUN mkdir -p logs && chown -R bun:bun /app

# Set user to bun
USER bun

CMD ["bun", "run", "start"]