FROM node:22-alpine

WORKDIR /app

ENV CI=true

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm build

ARG SERVICE_NAME
ENV SERVICE_NAME=${SERVICE_NAME}

CMD sh -c "node services/$SERVICE_NAME/dist/index.js"