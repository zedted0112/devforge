# Use official Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of the source
COPY . .

# Expose port for service
EXPOSE 3002

RUN npx prisma generate

# Start service
CMD ["npm", "run", "dev"]