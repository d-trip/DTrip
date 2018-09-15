<template lang="pug">
div
  div(v-html="html").content
  //.content {{ html }}

</template>

<script>
import marked from 'marked'
import { XmlEntities } from 'html-entities'
import { banner_md } from '~/constants'


const entities = new XmlEntities()

// TODO Доработать регулярку, negative lookahead support
const image_regex = /(:?[\s>])(https?:\/\/(?:[\da-zA-Z]{1}(?:[\w\-\.]+\.)+(?:[\w]{2,5}))(?:\:[\d]{1,5})?\/(?:[^\s\/]+\/).*?\.(?:jpe?g|gif|png)(?:\?\w+=\w+(?:\&\w+=\w+)*)?)/igm


//const image_regex = /(https?:\S*?\.(?:png|jpe?g|gif)(?:\?[^"']+?)?(?=<|\s))/

export default {
  props: ['body', 'format'],

  computed: {
    html() {
      let html
      if (this.format == 'markdown') {
        html = marked(this.body)
      } else {
				// FIXME Теперь это делает бекенд
				// Юзается только для редактора
        html = entities.decode(this.body)
        html = html.replace(image_regex, function(m) {
          return `${m[0]}<img src="${m.substr(1)}"></img>`
				})
      }

      return html
    }
  }
}
</script>

<style>
.content {
  color: #141823;
  overflow: hidden;
	padding: 0px 20px;
  letter-spacing: -0.5px;
  word-wrap: break-word;
  font: 21px/1.52 'PT Sans';
  -ms-word-wrap: break-word;
}

.content img {
  width: 100%;
  text-align: center;
  height: 100%;
}
</style>
