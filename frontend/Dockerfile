# Use Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose the Vite dev server port
EXPOSE 5176

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]
