# Stage 1: Build the application
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Install PM2 globally
RUN npm install -g pm2

# Copy the rest of the code
COPY . .

# Expose ports
EXPOSE 5000

# Start the app using PM2 but run npm start instead of index.js
CMD ["pm2-runtime", "npm", "--", "start"]
