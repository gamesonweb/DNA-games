FROM rust:1.67 as builder

RUN rustup target add x86_64-unknown-linux-musl
RUN apt update && apt install -y musl-tools musl-dev
RUN update-ca-certificates

WORKDIR ./tokyo_server

ADD src src
COPY ./Cargo.toml ./Cargo.toml

RUN echo "fn main() {}" > dummy.rs

RUN sed -i 's#src/main.rs#dummy.rs#' Cargo.toml
RUN cargo build --target x86_64-unknown-linux-musl --release

RUN sed -i 's#dummy.rs#src/main.rs#' Cargo.toml
RUN cargo build --target x86_64-unknown-linux-musl --release

#########################################

# Image with NodeJs and the rust executable
FROM node:14.5.0-alpine
WORKDIR main

# RUN apk add --no-cache libc6-compat

COPY --from=builder /tokyo_server/target/x86_64-unknown-linux-musl/release/tokyo_server ./tokyo_server.exe

ADD build-server build-server
ADD public public 

EXPOSE 8080/tcp
EXPOSE 8080/udp

RUN echo '{"dependencies": {"live-server": "^1.2.2","ws": "^8.12.0","xhr2": "^0.2.1"}}' > package.json

RUN npm i

CMD ls; ./tokyo_server.exe
