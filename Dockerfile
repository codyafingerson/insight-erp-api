# Use an official Node.js runtime as a base
FROM node:20-alpine AS base
WORKDIR /app

# Default to production build; can be overridden at build time
ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV}

# Copy prisma schema first to invalidate cache on schema changes
COPY prisma/schema.prisma ./prisma/

# Install dependencies 
# - If production, install only production dependencies 
# - If development, install all dependencies (including devDependencies for tools like nodemon)
COPY package*.json ./ 
RUN if [ "$NODE_ENV" = "production" ]; then \
      npm ci --only=production; \
    else \
      npm install; \
    fi

# Copy application source code
COPY . . 

# Build the app for production (compile TypeScript to JavaScript)
# Skip this step in development builds (nodemon will handle transpilation at runtime)
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

RUN chown -R node:node /app

# Use a non-root user for security in the final image
USER node

# Default command (production start). This will be overridden in docker-compose for dev.
CMD ["npm", "run", "start"]