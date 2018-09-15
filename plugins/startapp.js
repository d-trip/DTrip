import Vue from 'vue'
// TODO Сделать глобальную обработку для отображения
//Vue.config.errorHandler = function (err, vm, info) {
//
//}

export default ({app: { store }}) => {
  // FIXME Сделать отслеживание локи
  //navigator.geolocation.getCurrentPosition(function(location) {
  //  console.log(location.coords.latitude)
  //  console.log(location.coords.longitude)
  //  console.log(location.coords.accuracy)
  //})
  //

  window.onNuxtReady(() => {
    store.dispatch('auth/init')
    //store.dispatch('golos/init') TODO Пользовательские настройки
  })
}
