FROM node:18-alpine

WORKDIR /app/backend

COPY /backend .

RUN npm install

WORKDIR /app/frontend

COPY /frontend .

RUN npm install

RUN npm run build

RUN mv ./build ../backend

WORKDIR /app/backend

EXPOSE 4000

CMD ["npm", "run", "start"]