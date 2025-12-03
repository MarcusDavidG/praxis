# Dockerfile for Backend API + Workers
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm install --workspaces

# Copy source code
COPY apps/backend ./apps/backend
COPY packages/shared ./packages/shared

# Generate Prisma Client
WORKDIR /app/apps/backend
RUN npx prisma generate

# Expose port
EXPOSE 3001

# Set environment
ENV NODE_ENV=production

# Start the application (API + Workers)
CMD ["npm", "start"]
