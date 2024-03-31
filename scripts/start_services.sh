#!/bin/bash

# Start the frontend service
docker run -d -p 3000:3000 --name swiftwing-FE swiftwing-FE:1.0

# Start the backend service
docker run -d -p 5000:5000 --name swiftwing-BE swiftwing-BE:1.0
