FROM sitespeedio/node:ubuntu-20.04-nodejs-12.14.1
ENV NODE_ENV=production

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

COPY . .
CMD target\release\tokyo_server.exe