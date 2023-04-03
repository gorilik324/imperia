# Taken from: https://github.com/sapphiredev/examples/tree/main/examples/with-docker

# BASE IMAGE
FROM node:19-buster-slim as base

WORKDIR /opt/app

ENV HUSKY=0
ENV CI=true

RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends build-essential python3 libfontconfig1 dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --chown=node:node yarn.lock .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn/ .yarn/

ENV NODE_OPTIONS="--enable-source-maps"

COPY --chown=node:node package.json .
COPY --chown=node:node tsconfig.json .

RUN sed -i 's/"prepare": "husky install\( .github\/husky\)\?"/"prepare": ""/' ./package.json

ENTRYPOINT ["dumb-init", "--"]

# BUILD IMAGE
FROM base as build

RUN yarn install

COPY . /opt/app

RUN yarn run build

# PRODUCTION IMAGE
FROM base as production

ENV NODE_ENV="production"

COPY --from=build /opt/app/dist /opt/app/dist
COPY --from=build /opt/app/node_modules /opt/app/node_modules
COPY --from=build /opt/app/package.json /opt/app/package.json

RUN chown node:node /opt/app/

USER node

CMD [ "yarn", "run", "start"]
