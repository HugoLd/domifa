FROM node:12

COPY ./lerna.json /app/lerna.json
COPY ./package.json /app/package.json
COPY ./packages/frontend/package.json /app/packages/frontend/package.json
COPY ./packages/backend/package.json /app/packages/backend/package.json

WORKDIR /app

RUN yarn --frozen-lockfile --cache-folder /dev/shm/yarn

COPY ./packages/frontend/tsconfig.json /app/packages/frontend/tsconfig.json
COPY ./packages/frontend/angular.json /app/packages/frontend/angular.json
COPY ./packages/backend/tsconfig.build.json /app/packages/backend/tsconfig.build.json
COPY ./packages/backend/tsconfig.json /app/packages/backend/tsconfig.json

COPY ./packages/frontend/src /app/packages/frontend/src
COPY ./packages/backend/src /app/packages/backend/src

RUN yarn build --stream

COPY ./packages/frontend/jest.config.js /app/packages/frontend/jest.config.js
COPY ./packages/backend/jest.config.js /app/packages/backend/jest.config.js
COPY ./packages/backend/src/config/config.env /app/packages/backend/src/config/config.env
