FROM node:latest

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

# Install app dependencies
RUN npm install
RUN npm install pm2 -g

COPY . /usr/src/app

EXPOSE 3001

CMD ["npm", "run-script", "start"]