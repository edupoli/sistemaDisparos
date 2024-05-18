FROM node:18-alpine

LABEL version="1.0.0" description="Sistema Disparos" maintainer="Eduardo Policarpo<eduardopolicarpo@gmail.com>"

ENV NODE_ENV=production \
    TZ=America/Sao_Paulo 

WORKDIR /usr/local/app

COPY . .

RUN apk update \
    && apk add --no-cache dumb-init tzdata curl \
    && npm i -g pnpm \
    && pnpm install --ignore-scripts --production \
    && pnpm store prune \
    && mkdir -p logs tokens \
    && chown -R node:node logs tokens \
    && rm -rf /tmp/* /var/cache/apk/*

USER root

COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

CMD ["dumb-init", "/usr/local/bin/entrypoint.sh"]
