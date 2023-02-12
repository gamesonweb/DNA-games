# FROM cimg/rust:1.67-node
# #ENV NODE_ENV=production

# WORKDIR /home/circleci/project

# # ADD target target
# ADD build-server build-server
# ADD public public 
# ADD src src
# ADD Cargo* ./
# # COPY node_modules node_modules

# RUN echo '{"dependencies": {"live-server": "^1.2.2","ws": "^8.12.0","xhr2": "^0.2.1"}}' > package.json
# RUN npm i

# RUN cargo build
# # RUN npm i
# EXPOSE 8080/tcp
# EXPOSE 8080/udp

# # CMD ./target/release/tokyo_server.exe

# CMD cargo run

#########################################

# First image to build the compiled rust program
FROM rust:1.67 as builder

# create a work folder and instantiate all dependencies (separated from the rest for better caching)
RUN USER=root cargo new --bin tokyo_server
WORKDIR ./tokyo_server
COPY ./Cargo.toml ./Cargo.toml
RUN cargo build --release
RUN rm src/*.rs

# copy the rust code and compile it
ADD src/main.rs src/main.rs
ADD src/server src/server
RUN rm ./target/release/deps/tokyo_server*
RUN cargo build --release

#########################################

# Second image to launch the compiled rust program alongside the nodejs AI client
FROM debian:bullseye-slim
ARG APP=/usr/src/app

RUN apt-get update

EXPOSE 8080/tcp
EXPOSE 8080/udp

WORKDIR /usr/app

COPY --from=builder /tokyo_server/target/release/tokyo_server ./tokyo_server

RUN apt-get install -y nodejs npm
RUN echo '{"dependencies": {"live-server": "^1.2.2","ws": "^8.12.0","xhr2": "^0.2.1"}}' > package.json
RUN npm i
ADD build-server build-server
ADD public public 

CMD ["./tokyo_server"]