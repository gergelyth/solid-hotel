# 16.16.0 is the current LTS version of node
FROM node:16.16.0

USER node

# Define the ports our applications will run on
ENV PORT 3000
ENV PORT 3001
ENV PORT 3002
ENV PORT 3003

# Change directory to the user folder
WORKDIR /home/node

# Pull project source from GitHub
RUN git clone https://github.com/gergelyth/solid-hotel

# Change directory to the common folder
WORKDIR /home/node/solid-hotel/common

# Install dependencies
RUN npm install --force

# Move the node_modules directory one level higher so all projects can use it
RUN mv node_modules ..

# Change directory to the core folder
WORKDIR /home/node/solid-hotel

# # Build the apps
RUN cd common && npm run build
RUN cd gpa && npm run build
RUN cd pms && npm run build
RUN cd spe && npm run build

# Expose the ports used
EXPOSE 3000 3001 3002 3003

# Running the apps
# In order to spawn multiple processes and kill everything with a single CTRL+C, we keep everything in a subshell and kill that with a SIGINT
# (trap 'kill 0' SIGINT; process1 & process2)
CMD ["/bin/sh", "-c", "(trap 'kill 0' SIGINT; npm start --prefix /home/node/solid-hotel/gpa & npm start --prefix /home/node/solid-hotel/pms & npm start --prefix /home/node/solid-hotel/spe & npm start --prefix /home/node/solid-hotel/common)"]