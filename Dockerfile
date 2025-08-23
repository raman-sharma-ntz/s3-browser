FROM jarredsumner/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

EXPOSE 3000

ENV PORT=3000

CMD ["bun", "run", "src/index.ts"]
