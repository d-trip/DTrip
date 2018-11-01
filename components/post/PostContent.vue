<template lang="pug">
// TODO Youtube/DTube videos not rendering
div
  div(v-html="body").content

</template>

<script>
export default {
  props: ['body', 'format'],
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
  width: 100%;
  text-align: center;
  height: 100%;
}

@media (max-width: 992px) {
  .content {
    padding: 0px 0px;
  }
}
</style>
