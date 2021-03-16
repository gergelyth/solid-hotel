FROM node

USER node

ENV PORT 3000

# RUN mkdir -p /home/node/node_modules

# Create app directory
RUN mkdir -p /home/node/gpa
WORKDIR /home/node/gpa
# WORKDIR /home/node

# Installing dependencies
# COPY package*.json /home/node
COPY --chown=node:node package*.json /home/node/gpa/
# RUN npm install

# Copying source files
# COPY . /home/node
COPY --chown=node:node . /home/node/gpa

# Building app
# RUN npm run build
EXPOSE 3000

# Running the app
# CMD "npm" "run" "dev"
