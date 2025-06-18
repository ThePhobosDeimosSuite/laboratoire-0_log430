FROM node:lts-alpine
WORKDIR /usr/src/app
COPY ["package*.json", "./"]
RUN npm install
RUN npm prune
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["npm", "run", "api"]
