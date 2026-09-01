FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM alpine:3.20

WORKDIR /app

COPY --from=build /app/dist ./dist

VOLUME ["/app/dist"]