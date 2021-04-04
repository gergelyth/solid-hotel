FROM node

USER node

ENV PORT 3003

RUN mkdir -p /home/node/node_modules

# Create app directory
RUN mkdir -p /home/node/common
WORKDIR /home/node/common

# Installing dependencies
# COPY package*.json /home/node
COPY --chown=node:node package*.json /home/node/common/
RUN npm install --prefix .. ./
# RUN npm install 

# Copying source files
# COPY . /home/node
COPY --chown=node:node . /home/node/common

EXPOSE 3003