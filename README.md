DTrip client

Env:
> API_QL_URL: dtrip-api url
 
## Run local
```yarn run dev```

## SPA version
#### https://cloudflare-ipfs.com/ipns/dtrip.app/
```
yarn run build --spa
```
After that you can use the static version of the application from the dist folder.


## Run docker
Create .env file
```
docker-compose pull && docker-compose up -d
```

or build by you self

```
docker-compose up -d --build
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).
