FROM node:lts-alpine

WORKDIR /app

COPY . . 
RUN rm -rf /src/module
COPY ./src/module/stocks ./src/module/stocks

RUN npm install --omit=dev
RUN npm prune --omit=dev

WORKDIR /app/src/shared-utils
RUN npm run build

WORKDIR /app/src/module/stocks
RUN npx prisma generate
RUN npm run build
CMD ["npm", "run", "api"]
