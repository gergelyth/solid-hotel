FROM node

USER node

ENV PORT 3001

RUN mkdir -p /home/node/node_modules

# Create app directory
RUN mkdir -p /home/node/spe
WORKDIR /home/node/spe
# WORKDIR /home/node

# Installing dependencies
# COPY package*.json /home/node
COPY --chown=node:node package*.json /home/node/spe/
RUN npm install

# Copying source files
# COPY . /home/node
COPY --chown=node:node . /home/node/spe

# Building app
RUN npm run build
EXPOSE 3001

# Running the app
CMD "npm" "run" "dev"
