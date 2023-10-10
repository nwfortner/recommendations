FROM node:16-alpine
RUN mkdir -p /src/ && npm install -g npm@latest
WORKDIR /src/
COPY yarn.lock .
COPY package.json .
RUN yarn install --prod --non-interactive --silent --frozen-lockfile
COPY . ./
CMD ["node", "index.js"]
