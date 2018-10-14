<template lang="pug">
no-ssr
  nuxt-link(:to="{name: 'editor-permlink'}", style="text-decoration: none;").add-post.mb-3
    .av-wrap
      img(class="user_av",
          :src="user.name | avatar")
    .write-post.ml-3 Create a Publication

</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters('auth', ['user']),
  }
}
</script>


<style>
.write-post {
  font: 16px PT Sans;
  letter-spacing: -.5px;
  color: rgba(72,84,101,.7);
}

.add-post {
  width: 100%;
  height: 60px;
  border-radius: 6px;
  background-color: #fff;
  -webkit-box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
  box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
  border: 1px solid rgba(72,84,101,.2);
  padding: 0 16px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
}

</style>
