import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import config from '@/config'

export default (ctx) => {
  const link = new HttpLink({ uri: config.API_QL_URL })

  return {
    link,
    cache: new InMemoryCache()
  }
}
