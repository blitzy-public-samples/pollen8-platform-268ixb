# Use the official Node.js 18 Alpine image as the base
FROM node:18-alpine

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json (if exists) to the working directory
COPY package*.json ./

# Install dependencies using npm ci for a clean and reproducible install
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript code into JavaScript
RUN npm run build

# Expose port 3000 for the application
EXPOSE 3000

# Specify the command to run the compiled backend application
CMD ["node", "dist/main.js"]