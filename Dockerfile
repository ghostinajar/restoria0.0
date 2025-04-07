# Stage 1: Builder
FROM node:20-slim as builder

# Set working directory
WORKDIR /usr/src/app

# Only copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Stage 2: Final image
FROM node:20-slim

WORKDIR /usr/src/app

# Copy only what's needed from builder stage
COPY --from=builder /usr/src/app ./

# Expose the app port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
