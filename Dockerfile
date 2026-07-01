FROM nginx:alpine

LABEL maintainer="GymHub Women <hello@gymhubwomen.com>"
LABEL description="GymHub Women AI Coach — React Frontend"

# Copy app static files
COPY index.html /usr/share/nginx/html/
COPY bundle.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/

# Copy all images
COPY *.png /usr/share/nginx/html/

# Nginx config: serve static + proxy /api/* to backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
