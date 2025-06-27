FROM node:lts-alpine

WORKDIR /app
# I'm sure there's a better way than copying everything...
COPY . . 

RUN npm install
RUN npm prune

WORKDIR /app/src/shared-utils
RUN npm run build

WORKDIR /app/src/module/checkout
RUN npm run build
CMD ["npm", "run", "api"]
