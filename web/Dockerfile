# ARG web_version

# FROM node:${web_version}
FROM node:19.2-alpine3.16

WORKDIR /app

COPY package.json .

RUN yarn

EXPOSE 5173

CMD ["yarn", "dev"]
