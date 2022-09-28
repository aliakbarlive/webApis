FROM node:14-alpine AS builder

ENV NODE_ENV development
ENV REACT_APP_API_BASE_URL http://test-app.betterseller.com/api/v1

WORKDIR /app

COPY ./package.json /app/
RUN npm install --silent
RUN npm install npm-run-all -g --silent
RUN npm install -g env-cmd
COPY . /app

RUN REACT_APP_API_BASE_URL=http://test-app.betterseller.com/api/v1 npm run build

FROM nginx:latest

COPY --from=builder /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
