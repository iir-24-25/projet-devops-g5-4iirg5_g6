# Stage 1: Build the React app with Vite
FROM node:16 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json for the frontend
COPY package.json package-lock.json ./ 

# Install dependencies for the frontend
RUN npm install

# Copy the rest of the frontend files into the container
COPY ./ ..

# Build the app using Vite
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the built app from the build stage into Nginx’s HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to allow access to the frontend app
EXPOSE 80

# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
