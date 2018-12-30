<template lang="pug">
// TODO Youtube/DTube videos not rendering
div
  div(v-html="html").content

</template>

<script>
import sanitizeHtml from 'sanitize-html'

export default {
  props: ['body', 'format'],

  computed: {
    html() {
      return sanitizeHtml(this.body, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      })
    }
  }
}
</script>

<style>
.content {
  color: #141823;
  overflow: hidden;
  letter-spacing: -0.5px;
  word-wrap: break-word;
  font: 21px/1.52 'PT Sans';
  -ms-word-wrap: break-word;
}

.post-content .c_text img {
  /*max-height: 492px;*/
  max-width: 100%;
  text-align: center;
  margin: 24px auto;
  width: auto;
}

.content img {
  max-width: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 992px) {
  .content {
    padding: 0px 0px;
  }
}
</style>
