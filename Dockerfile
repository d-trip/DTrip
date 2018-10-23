FROM mhart/alpine-node:9.11.1

ENV HOST 0.0.0.0

ARG API_QL_URL=https://api.dtrip.app/graphql
ARG PROD=True
ARG BASE_URL=https://dtrip.app/
# Sentry for debug reports
ARG SENTRY_DSN=https://e00d35317557416b9ef3e69b7df52b50@sentry.io/1306350

ENV SENTRY_DSN ${SENTRY_DSN}
ENV API_QL_URL ${API_QL_URL}
ENV PROD ${PROD}
ENV BASE_URL ${BASE_URL}

ADD package.json /app/
ADD yarn.lock /app/
WORKDIR /app

RUN yarn install --production

# COPY . .
ADD . /app

RUN yarn run build --production

EXPOSE 3000
