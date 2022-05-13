FROM node:latest

RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install

COPY . /app

RUN npm run build

EXPOSE 8000

ENTRYPOINT ["npm"]

CMD ["start"]