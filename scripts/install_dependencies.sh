#!/bin/bash
docker build -t swiftwing-fe:1.0 -f ../Ui-devias/Dockerfile .

docker build -t swiftwing-be:1.0 -f ../api/Dockerfile .