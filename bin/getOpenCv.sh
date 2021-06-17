#!/bin/bash

DIR=$(cd $(dirname $0)/../src; pwd)
curl https://docs.opencv.org/3.4.0/opencv.js > ${DIR}/opencv.js

