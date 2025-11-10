# Base image
FROM mysql:8.0

# Copy initial setup script into MySQL container
COPY setup.sql /docker-entrypoint-initdb.d/setup.sql

# Set root password
ENV MYSQL_ROOT_PASSWORD=StrongRootPassword!2025

EXPOSE 3306
