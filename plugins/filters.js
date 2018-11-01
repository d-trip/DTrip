import Vue from 'vue'
import moment from 'moment'
import sbd from 'sbd'

import config from '~/config'

Vue.filter('avatar', (user = '', size = 'medium') => `https://steemitimages.com/u/${user}/avatar/${size}`)

Vue.filter('html_preview', (html) => {
  return sbd.sentences(html, {
		sanitize: true
	}).slice(0, 2).join(' ')
})

Vue.filter('convertGBG', (value = 0) => {

  return (value * 2.60424).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
})


Vue.filter('formatDate', (value = '') => {
  moment.locale('en')

  return moment.utc(value.toString()).fromNow()
})

Vue.filter('steem_proxy', (value, size) => {
  return `${config.img_proxy_prefix}${size}/${value}`
})
