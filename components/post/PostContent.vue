<template lang="pug">
div
  div(v-html="body").content

</template>

<script>
import marked from 'marked'
import { XmlEntities } from 'html-entities'
import { banner_md } from '~/constants'
import prepare_html from '~/utils/prepare_html'


export default {
  props: ['body', 'format'],
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
