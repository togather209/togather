# Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 빌드 명령어 실행
RUN npm run build

EXPOSE 3000

CMD ["npm", "run","dev"]