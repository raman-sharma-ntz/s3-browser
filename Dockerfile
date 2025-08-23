FROM node:22-alpine
WORKDIR /usr/src/app
COPY package.json bun.lock* ./
RUN npm install -g bun && bun install
COPY . .
EXPOSE 3000/tcp
CMD ["bun", "run", "src/index.ts"]
