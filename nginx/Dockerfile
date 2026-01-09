FROM nginx:alpine

# Install openssl for self-signed cert generation
RUN apk add --no-cache openssl

# Create SSL directory and generate self-signed certificate
RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=FR/ST=France/L=Agde/O=AgdeMoto/CN=agdemoto.fr"

# Copy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
