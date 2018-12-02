DTrip client

Env:
> API_QL_URL: dtrip-api url
 
## Run for local development
```yarn run dev```

## SPA version
#### https://cloudflare-ipfs.com/ipns/dtrip.app/
```
docker-compose run --rm spa-build
```
After that you can use the static version of the application from the ```dist``` folder.
```
ipfs add -r dist/ && ipfs pin add -r QmfNahuxXhmr39iWvzJGDAYpXjwvTH5ZfNgS4EJgtHDsaa
```


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
