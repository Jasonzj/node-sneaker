FROM node:lts-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

EXPOSE 4455

CMD ["node", "./dist/app.js"]