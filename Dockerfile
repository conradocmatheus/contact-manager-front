FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM golang:1.26-alpine AS caddy-build

ARG CADDY_VERSION=v2.11.4

RUN apk add --no-cache git
WORKDIR /src
RUN git clone --depth 1 --branch "${CADDY_VERSION}" https://github.com/caddyserver/caddy.git
WORKDIR /src/caddy
RUN go get golang.org/x/net@v0.56.0 \
    golang.org/x/text@v0.39.0 \
    google.golang.org/grpc@v1.82.1 && \
    go mod tidy && \
    CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /usr/bin/caddy ./cmd/caddy

FROM caddy:2.11.4-alpine

RUN apk upgrade --no-cache

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=caddy-build /usr/bin/caddy /usr/bin/caddy
COPY --from=build /app/dist/contact-manager-front/browser /srv

EXPOSE 80 443
