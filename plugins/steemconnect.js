import Vue from 'vue'
import VueSteemConnect from 'vue-steemconnect'

import config from '~/config'

Vue.use(VueSteemConnect, {
  app: 'dtrip.app',
  callbackURL: config.AUTH_CALLBACK,
  scope: ['vote', 'comment', 'comment_options', 'custom_json']
})


// export default ({app: { store }}) => {
//  store.registerModule('steemconnect', Vue.SteemConnectStore)
// }
