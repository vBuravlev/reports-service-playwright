FROM node:20-alpine

WORKDIR /app

RUN apk update && apk add --no-cache bash curl wget

COPY package*.json ./

RUN npm install

COPY . .

RUN npm i -g sequelize-cli

RUN chmod +x startup.sh

EXPOSE 3000

ENTRYPOINT [ "./startup.sh" ]