import Vue from 'vue'
import moment from 'moment'
import marked from 'marked'
import sbd from 'sbd'

import config from '~/config'

import prepare_html from '@/utils/prepare_html'



Vue.filter('avatar', (user = '', size = 'small') => `https://steemitimages.com/u/${user}/avatar/${size}`)

Vue.filter('html_preview', (post) => {
  let html

  if (post.meta.format == 'markdown') {
    html = prepare_html(marked(post.body))
  } else {
    html = prepare_html(post.body)
  }

  return sbd.sentences(html.html, {
		sanitize: true
	}).slice(0, 2).join(' ')
})

Vue.filter('convertGBG', (value = 0) => {

  return (value * 2.60424).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
})


Vue.filter('formatDate', (value = '') => {
  moment.locale('ru')

  return moment.utc(value.toString()).fromNow()
})

Vue.filter('golos_proxy', (value, size) => {
  return `${config.img_proxy_prefix}${size}/${value}`
})
