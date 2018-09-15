import { sync } from 'vuex-router-sync'

export default ({app: {router, store}}) => {
  sync(store, router)
}
