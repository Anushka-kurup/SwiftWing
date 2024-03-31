#!/bin/bash
docker build -t swiftwing-fe:1.0 -f /SwiftWing/Ui-devias/Dockerfile .

docker build -t swiftwing-be:1.0 -f /SwiftWing/api/Dockerfile .