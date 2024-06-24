FROM node:20-alpine3.20 as build

WORKDIR /usr/src/app

COPY package*.json  ./

RUN npm ci

COPY . .

RUN npm run build


FROM nginx:1-alpine3.19
EXPOSE 3002

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/dist /usr/share/nginx/html


