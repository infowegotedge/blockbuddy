FROM node:alpine

RUN mkdir /app
WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 8912

CMD ["npm", "start"]