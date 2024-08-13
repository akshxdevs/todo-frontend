FROM node:alpine3.18 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist .
EXPOSE 4000
ENTRYPOINT ["nginx", "-g", "daemon off;"]
