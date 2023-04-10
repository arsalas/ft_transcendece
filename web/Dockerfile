ARG web_version

FROM node:$web_version

WORKDIR /app

COPY package.json .

RUN yarn

EXPOSE 5173

CMD ["yarn", "dev"]
