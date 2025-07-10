FROM node:lts-alpine

WORKDIR /app

COPY . . 
RUN rm -rf /src/module
COPY ./src/module/event-store ./src/module/event-store

RUN npm install --omit=dev
RUN npm prune --omit=dev

WORKDIR /app/src/shared-utils
RUN npm run build

WORKDIR /app/src/module/event-store
RUN npx prisma generate
RUN npm run build
CMD ["npm", "run", "api"]
