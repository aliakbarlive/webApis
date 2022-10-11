FROM node:lts-alpine

ENV NODE_ENV development
ENV SP_API_REDIRECT_URL https://local.stalliondirect.com/onboarding


WORKDIR /app
COPY package.json .
RUN npm install 
COPY . .

CMD ["npm", "run", "start"]