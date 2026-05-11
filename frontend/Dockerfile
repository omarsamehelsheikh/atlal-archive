# Stage 1: Build
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
# Using legacy-peer-deps to handle the TypeScript conflict we saw earlier
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine
# Copy the built React files to Nginx's serving directory
COPY --from=build /app/build /usr/share/nginx/html
# Copy your custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]