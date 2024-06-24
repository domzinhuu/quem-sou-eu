FROM node:20-alpine3.20

WORKDIR /usr/src/app

COPY ./server/package*.json ./

RUN npm ci

COPY server/ .

RUN ls

EXPOSE 3333

CMD [ "npm", "start" ]