# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
# Add before RUN npm install
RUN apk add --no-cache curl
RUN npm install

# Copy source files
COPY . .

# Expose the gateway port
EXPOSE 3000

# Build the TypeScript code
RUN npm run build

# Start the gateway app
CMD ["node", "dist/index.js"]
