<template lang="pug">
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
