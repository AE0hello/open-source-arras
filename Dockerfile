FROM node:22-alpine

WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache make g++

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 3011 3012 3013 3014 3015 3016 3017
CMD ["npm", "start"]
