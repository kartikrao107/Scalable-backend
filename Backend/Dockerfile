FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG DATABASE_URL

ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate

EXPOSE 3000

CMD ["sh","-c","npx prisma migrate deploy && npm start"]