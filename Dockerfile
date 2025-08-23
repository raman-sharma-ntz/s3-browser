FROM node:22-alpine
WORKDIR /usr/src/app
COPY package.json bun.lock* ./
RUN npm install -g bun && bun install
COPY . .
ENV PORT=3000
EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
