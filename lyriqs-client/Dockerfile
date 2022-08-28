# Stage 1: Build
FROM node:latest as build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Run
FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/lyriqs-client /usr/share/nginx/html