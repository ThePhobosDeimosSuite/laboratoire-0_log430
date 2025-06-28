FROM node:lts-alpine

WORKDIR /app
# I'm sure there's a better way than copying everything...
COPY . . 

RUN npm install --production
RUN npm prune

WORKDIR /app/src/shared-utils
RUN npm run build

WORKDIR /app/src/module/sales
RUN npx prisma generate
RUN npm run build
CMD ["npm", "run", "api"]
