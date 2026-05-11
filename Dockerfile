FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/
COPY . .

RUN pnpm install --frozen-lockfile --prod

EXPOSE 8080

CMD ["pnpm", "start"]
