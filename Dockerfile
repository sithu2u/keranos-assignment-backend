FROM node:20-bullseye-slim

# Set environment variables for OpenCV version
ENV OPENCV_VERSION=4.6.0

# Install required build tools and OpenCV dependencies
RUN apt-get update && apt-get install -y \
  build-essential \
  cmake \
  git \
  wget \
  unzip \
  yasm \
  pkg-config \
  libgtk-3-dev \
  libjpeg-dev \
  libpng-dev \
  libtiff-dev \
  libavcodec-dev \
  libavformat-dev \
  libswscale-dev \
  libv4l-dev \
  libxvidcore-dev \
  libx264-dev \
  libopenblas-dev \
  libatlas-base-dev \
  liblapack-dev \
  libhdf5-dev \
  gfortran \
  python3-dev \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Download and build OpenCV
RUN mkdir -p /opencv_build && cd /opencv_build && \
  wget -O opencv.zip https://github.com/opencv/opencv/archive/${OPENCV_VERSION}.zip && \
  wget -O opencv_contrib.zip https://github.com/opencv/opencv_contrib/archive/${OPENCV_VERSION}.zip && \
  unzip opencv.zip && unzip opencv_contrib.zip && \
  mkdir -p opencv-${OPENCV_VERSION}/build && cd opencv-${OPENCV_VERSION}/build && \
  cmake -D CMAKE_BUILD_TYPE=RELEASE \
        -D CMAKE_INSTALL_PREFIX=/usr/local \
        -D OPENCV_EXTRA_MODULES_PATH=/opencv_build/opencv_contrib-${OPENCV_VERSION}/modules \
        -D BUILD_EXAMPLES=OFF \
        -D BUILD_TESTS=OFF \
        -D BUILD_PERF_TESTS=OFF \
        -D WITH_TBB=ON \
        -D WITH_V4L=ON \
        -D WITH_QT=OFF \
        -D WITH_OPENGL=ON \
        .. && \
  make -j$(nproc) && make install && ldconfig && \
  rm -rf /opencv_build

# Set environment variables for opencv4nodejs to use built OpenCV
ENV OPENCV4NODEJS_DISABLE_AUTOBUILD=1
ENV OPENCV_INCLUDE_DIR=/usr/local/include/opencv4
ENV OPENCV_LIB_DIR=/usr/local/lib
ENV LD_LIBRARY_PATH=/usr/local/lib

# Create app directory
WORKDIR /app

# Install Node.js dependencies
COPY package*.json ./
# Install node-gyp globally, often required for native module compilation
RUN npm install -g node-gyp

RUN npm install --unsafe-perm
RUN npm rebuild opencv4nodejs --unsafe-perm

# Copy source code
COPY . .

CMD ["npm", "run", "dev"]

ENV PORT=3000

EXPOSE $PORT

# 
# docker build -t grading:backend .
#
#change default port on image
# docker build -t assignment:backend --build-arg DEFAULT_PORT:3000 .

# docker run -d -p 3000:3000 --rm --name backend_nodejs -v assignment_backend_uploads:/app/uploads -v "/Users/eieikhin/nodejs/assignments/backend_nodejs":/app:ro -v /app/node_modules assignment:backend

#mount current dir
#docker run -d -p 3000:3000 --rm --name backend_nodejs -v assignment_backend_uploads:/app/uploads -v $(pwd):/app:ro -v /app/node_modules assignment:backend

#attach
#docker run -it -p 3000:3000 --rm --name backend_nodejs -v assignment_backend_uploads:/app/uploads -v $(pwd):/app:ro -v /app/node_modules grading:backend

#docker run -it -v $(pwd):/app:ro -v grading_backend:/app/uploads -v /app/node_modules --rm grading:backend bash

#docker run -it -p 3000:3000  --name grading_container -v $(pwd):/app:ro -v grading_backend:/app/uploads -v /app/node_modules --rm grading:backend

# docker exec -it grading_container bash
# docker cp grading_backend:/app/uploads ./volume/uploads

