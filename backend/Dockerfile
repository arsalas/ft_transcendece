FROM node:19.2-alpine3.16

WORKDIR /app

COPY package.json .

RUN yarn

EXPOSE 3000
ENV CHOKIDAR_USEPOLLING=true

CMD ["yarn", "start:dev"]
