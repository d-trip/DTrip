import Vue from 'vue'

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
