FROM node:lts-alpine

WORKDIR /app

COPY . . 
RUN rm -rf /src
COPY ./src/test ./src/test

WORKDIR /app/src/test/test-runner

RUN npm install --omit=dev
RUN npm prune --omit=dev
