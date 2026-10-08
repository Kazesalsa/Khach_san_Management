# Stage 1: Build giao dien
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Phuc vu file tinh (static files) bang Nginx
FROM nginx:alpine
# Copy code da build vao thu muc cua Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Ghi de file cau hinh mac dinh cua Nginx de ho tro React Router (tra ve index.html cho moi route)
# Tao file cau hinh ngan gon va ghi de
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
