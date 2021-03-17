FROM node

USER node

ENV PORT 3002

# RUN mkdir -p /home/node/node_modules

# Create app directory
RUN mkdir -p /home/node/pms
WORKDIR /home/node/pms
# WORKDIR /home/node

# Installing dependencies
# COPY package*.json /home/node
COPY --chown=node:node pms/package*.json /home/node/pms/
# RUN npm install --prefix .. ./
# RUN npm install 

# Copying source files
# COPY . /home/node
COPY --chown=node:node ./pms /home/node/pms

# Building app
# RUN npm run build
EXPOSE 3002

# Running the app
# CMD "npm" "run" "dev"
