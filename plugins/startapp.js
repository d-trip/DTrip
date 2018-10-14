import Vue from 'vue'
// TODO Add all errors handler
//Vue.config.errorHandler = function (err, vm, info) {
//
//}

export default ({app: { store }}) => {
  // FIXME Ask for user location
  //navigator.geolocation.getCurrentPosition(function(location) {
  //  console.log(location.coords.latitude)
  //  console.log(location.coords.longitude)
  //  console.log(location.coords.accuracy)
  //})
  //

  window.onNuxtReady(() => {
    store.dispatch('auth/init')
  })
}
