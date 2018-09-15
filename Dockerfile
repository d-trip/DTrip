FROM mhart/alpine-node:9.11.1

ENV HOST 0.0.0.0

ARG API_QL_URL
ARG PROD
ARG SENTRY_DSN
ARG BASE_URL

ENV API_QL_URL ${API_QL_URL}
ENV PROD ${PROD}
ENV SENTRY_DSN ${SENTRY_DSN}
ENV BASE_URL ${BASE_URL}

ADD package.json /app/
ADD yarn.lock /app/
WORKDIR /app

RUN yarn install --production

# COPY . .
ADD . /app

RUN yarn run build --production

EXPOSE 3000
