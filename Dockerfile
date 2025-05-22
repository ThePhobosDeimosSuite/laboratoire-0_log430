FROM node:lts-alpine
WORKDIR /usr/src/app
COPY ["package*.json", "./"]
RUN npm install
RUN npm prune
COPY . .
RUN npm run build
RUN npx prisma generate
CMD ["npm", "start"]
