# Build stage
FROM node:18 AS build

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install
# Install the required polyfill packages
RUN npm install --save crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url vite-plugin-node-polyfills

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
