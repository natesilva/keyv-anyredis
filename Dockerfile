FROM node:16-alpine
WORKDIR /repo
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
RUN mkdir -p node_modules
RUN wget -P /usr/bin https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for \
    && chmod +x /usr/bin/wait-for
