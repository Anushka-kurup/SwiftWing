#!/bin/bash
docker build -t swiftwing-FE:1.0 -f /var/www/html/frontend/Dockerfile .

docker build -t swiftwing-BE:1.0 -f /var/www/html/backend/Dockerfile .