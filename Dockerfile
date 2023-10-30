FROM node:latest


WORKDIR /app

COPY ./frontend/package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm install -g npm
RUN npm install

COPY ./frontend ./

CMD ["npm","run","start"]