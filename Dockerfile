FROM node:18-alpine
WORKDIR /repo
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
RUN mkdir -p node_modules
