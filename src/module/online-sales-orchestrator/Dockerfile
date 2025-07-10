FROM node:lts-alpine

WORKDIR /app

COPY . . 
RUN rm -rf /src/module
COPY ./src/module/online-sales-orchestrator ./src/module/online-sales-orchestrator

RUN npm install --omit=dev
RUN npm prune --omit=dev

WORKDIR /app/src/shared-utils
RUN npm run build

WORKDIR /app/src/module/online-sales-orchestrator
RUN npm run build
CMD ["npm", "run", "api"]
