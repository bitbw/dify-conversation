FROM --platform=linux/amd64 node:21-bullseye-slim

WORKDIR /app

COPY . .

RUN pnpm install
RUN pnpm build

EXPOSE 3000

CMD ["pnpm","start"]
