import Vue from 'vue'
import moment from 'moment'
import marked from 'marked'
import sbd from 'sbd'

import config from '~/config'

import prepare_html from '@/utils/prepare_html'
import { escapeHtml } from '@/utils'


let regex = /((?:https?\:\/\/)(?:[a-zA-Z]{1}(?:[\w\-\.]+\.)+(?:[\w]{2,5}))(?:\:[\d]{1,5})?\/(?:[^\s\/]+\/)*(?:[^\s]+\.(?:jpe?g|gif|png))(?:\?\w+=\w+(?:&\w+=\w+)*)?)[^"']*/


Vue.filter('html_preview', (value = '') => {
  return sbd.sentences(marked(value), {
		sanitize: true,
		newline_boundaries: true,
		html_boundaries: true,
	}).slice(0, 2).join(' ')
})

Vue.filter('convertGBG', (value = 0) => {

  return (value * 2.60424).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
})


Vue.filter('formatDate', (value = '') => {
  moment.locale('ru')

  return moment.utc(value.toString()).fromNow()
})

Vue.filter('markdown', (value = '') => {
	value = unescape(value)
  const body = value.replace(regex, '![]($1)')

  return marked(body)
})

Vue.filter('golos_html', (value = '') => {
	// TODO Хуево работает редактор
	value = unescape(value)
  return prepare_html(value.replace(regex, '<img src="$1">')).html
})

Vue.filter('golos_proxy', (value, size) => {
  return `${config.img_proxy_prefix}${size}/${value}`
})


Vue.filter('body_preview', (value = '', length=50) => {
	let tmp = document.createElement("DIV");

	tmp.innerHTML = value;
  let text = tmp.textContent || tmp.innerText

	return text.slice(0, length);
})
