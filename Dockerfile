FROM risingstack/alpine:3.3-v4.2.6-1.1.3
ENV NODE_ENV=production

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

COPY . .
CMD ["./target/release/tokyo_server"]