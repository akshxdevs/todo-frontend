FROM node:alpine3.18 AS build

ARG REACT_APP_NODE_ENV
ARG REACT_APP_SERVER_BASE_URL

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist .
EXPOSE 3001
ENTRYPOINT ["nginx", "-g", "daemon off;"]


