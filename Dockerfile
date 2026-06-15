FROM node:22-alpine

WORKDIR /app

ENV CI=true

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm build

CMD ["node", "services/auth-service/dist/index.js"]