FROM node:16.15.1-stretch-slim AS build

WORKDIR /dest

COPY ./package* .
COPY ./.env .

RUN npm install

COPY . .
COPY configs/missing-configs.js public/c.js

RUN npm run build:vite

FROM caddy:2.4.6-alpine
COPY --from=build /dest/caddy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /dest/build /usr/share/caddy
CMD caddy run --config /etc/caddy/Caddyfile
ENTRYPOINT ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
EXPOSE 5000
