FROM triplet/nginx

COPY ["dist/*", "/var/www/"]
