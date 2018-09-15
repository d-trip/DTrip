import Vue from 'vue'

import * as VueGoogleMaps from '~/node_modules/vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBUggg4I6FWB6sHijJGpXvBDdoZKqi1J7Y',
    libraries: 'places'
  }
})
