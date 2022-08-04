FROM sitespeedio/node:ubuntu-20.04-nodejs-12.14.1
#ENV NODE_ENV=production

COPY . .
RUN ls
CMD ./target/release/tokyo_server