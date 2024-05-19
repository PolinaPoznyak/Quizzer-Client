FROM node:21-alpine3.18
WORKDIR /app/client
COPY . .
WORKDIR /app/client/vite-project

RUN npm i 

CMD ["npm", "run", "dev"]