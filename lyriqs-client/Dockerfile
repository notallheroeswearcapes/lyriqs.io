FROM node:latest
WORKDIR /lyriqs-client
COPY . .
RUN npm install
RUN npm run build --prod#stage 2
FROM nginx:alpine
COPY --from=node /client/dist/demo-app /usr/share/nginx/html
