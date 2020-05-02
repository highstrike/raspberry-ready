FROM arm32v7/node:12.16.2-alpine

RUN apk --update --no-cache add --virtual dependencies curl build-base python && \
    cd /tmp && \
    curl -s https://api.github.com/repos/joan2937/pigpio/releases/latest \
    | grep 'tarball_url.*' \
    | cut -d : -f 2,3 \
    | tr -d \", \
    | xargs -n 1 curl -sSL \
    | tar -xz --strip-components=1 && \
    make && \
    sed -i 's/ldconfig/ldconfig \/usr\/local/g' Makefile && \
    make install && \
    rm -rf /tmp/*

WORKDIR /app

COPY package.json /app
RUN npm install

COPY start.js /app
CMD ["npm", "start"]
