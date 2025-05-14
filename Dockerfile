FROM node:lts-alpine
WORKDIR /usr/src/app
COPY ["package*.json", "./"]
RUN npm install
RUN npm prune
COPY . .
CMD ["npm", "start"]
