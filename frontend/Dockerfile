# Use Nginx directly - NO NODE, NO BUILD
FROM nginx:stable-alpine
# Copy the build folder you already made on Windows
COPY build /usr/share/nginx/html
# Copy your config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]