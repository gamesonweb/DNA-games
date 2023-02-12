FROM cimg/rust:1.67-node
#ENV NODE_ENV=production

WORKDIR /home/circleci/project

# ADD target target
ADD build-server build-server
ADD public public 
ADD src src
ADD Cargo* ./
# COPY node_modules node_modules

RUN echo '{"dependencies": {"live-server": "^1.2.2","ws": "^8.12.0","xhr2": "^0.2.1"}}' > package.json
RUN npm i

RUN cargo build
# RUN npm i
EXPOSE 8080/tcp
EXPOSE 8080/udp

# CMD ./target/release/tokyo_server.exe

CMD cargo run