# 빌드 단계
FROM node:20.15.0 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Nginx 단계
FROM nginx:alpine

# Nginx 기본 HTML 폴더에 빌드 결과물 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx를 포그라운드에서 실행
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
