FROM node:16


WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN mv .env.production .env
 
EXPOSE 5000
CMD [ "npm", "start" ]