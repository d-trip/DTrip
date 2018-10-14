import Vue from 'vue'
import VueSteemConnect from 'vue-steemconnect'

Vue.use(VueSteemConnect, {
  app: 'dtrip.app',
  callbackURL: 'http://localhost:3000/auth',
  scope: ['vote', 'comment', 'comment_options', 'custom_json']
})


// export default ({app: { store }}) => {
//  store.registerModule('steemconnect', Vue.SteemConnectStore)
// }
