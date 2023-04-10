ARG web_version

FROM node:$web_version

WORKDIR /app

COPY package.json .

RUN yarn

EXPOSE 3000

CMD ["yarn", "start:dev"]
