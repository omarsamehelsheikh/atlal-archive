# We use the slim nginx image since no building happens here
FROM nginx:stable-alpine

# Copy the build folder you just created locally into the container
COPY build /usr/share/nginx/html

# Copy your nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]