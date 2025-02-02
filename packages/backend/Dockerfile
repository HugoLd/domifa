# ---------------------------------------------------------
# 1) BUILDER IMAGE
# ---------------------------------------------------------
FROM node:17.9-bullseye-slim as builder

ENV TZ Europe/Paris

RUN cp /usr/share/zoneinfo/Europe/Paris /etc/localtime

# resolve dependencies
WORKDIR /tmp/app-yarn
COPY ./packages/backend/package.json /tmp/app-yarn/
COPY ./yarn.lock /tmp/app-yarn/
RUN yarn --frozen-lockfile && yarn cache clean

# add source & move dependencies into sources directory
WORKDIR /app
COPY ./packages/backend /app
# NOTE: cp is faster than mv in a docker container
RUN cp -R /tmp/app-yarn/node_modules  /app/node_modules

# build app
RUN yarn build

# ---------------------------------------------------------
# 2) FINAL IMAGE
# ---------------------------------------------------------
FROM node:17.9-bullseye-slim

ARG DOMIFA_VERSION
ENV DOMIFA_VERSION=$DOMIFA_VERSION

# install common tools
ENV CORE_PACKAGES pdftk
# sudo bash wget vim git bash-completion xsel rubygems build-essential ruby-dev pdftk

# install via APT
RUN apt-get update && \
    apt-get install -q -y -o Acquire::Retries=10 $CORE_PACKAGES && \
# immediately remove temporary files
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

USER node

WORKDIR /app
COPY ./packages/backend/package.json /app
COPY ./yarn.lock /app
RUN yarn --production --frozen-lockfile && yarn cache clean

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/.env.preset /app/.env.preset

ENTRYPOINT ["yarn", "start:prod"]
