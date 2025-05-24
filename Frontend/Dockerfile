# Stage 1: Build the React app with Vite
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependencies
COPY package.json package-lock.json ./

# Set NODE_ENV to production to avoid installing unnecessary dependencies
ENV NODE_ENV=production

# Install dependencies
RUN npm install

# Copy the rest of the app's files
COPY . ./

# Build the app using Vite
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the built app from the first stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to access the app
EXPOSE 80

# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
