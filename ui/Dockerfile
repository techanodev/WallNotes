FROM node:latest

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY yarn.lock ./
RUN yarn
RUN yarn add react-scripts -g

# add app
COPY . ./

EXPOSE 3000

CMD ["yarn", "start"]