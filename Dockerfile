FROM node:boron-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm --production install

# Bundle app source
COPY build /usr/src/app/
RUN chmod 755 /usr/src/app/
# RUN ls -lRa /usr/src/app/* 

EXPOSE 3000
CMD [ "node", "main" ]