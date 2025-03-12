# --- Builder Stage ---
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy package files and prisma schema for dependency caching
COPY package*.json ./
COPY prisma/schema.prisma ./prisma/

# Install all dependencies (including devDependencies)
RUN bun install

# Copy the remaining source code
COPY . .

# Build the application (transpile TypeScript, etc.)
RUN bun run build

# --- Production Stage ---
FROM oven/bun:1 AS production
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Copy only necessary artifacts from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Prepare application directories and adjust permissions
RUN mkdir -p logs && chown -R bun:bun /app

# Switch to non-root user for runtime
USER bun

CMD ["bun", "run", "start"]
