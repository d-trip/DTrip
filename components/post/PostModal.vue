<template lang="pug">
.row
  .col(v-loading="loading").loading.post-in-modal
    post(v-if="post" :post="post")
    not-found(v-if="notFound").mt-5

    // TODO Сделать стрелки
    //a(v-if="true" class="next_post") sadf
    //a(v-if="true" class="prev_post") adf
</template>

<script>
import { mapActions } from 'vuex'
import Post from '~/components/post/Post.vue'
import NotFound from '~/components/errors/NotFound.vue'
import { getContent } from '~/utils/steem'

export default {
  props: ['author', 'permlink'],

  components: {
    Post,
    NotFound
  },

  data () {
    return {
      loading: false,
      notFound: false,

      post: null
    }
  },

  watch: {
    $route (to, from){
      this.$emit('close')
    }
  }, 

  async created() {
    this.loading = true
    this.post = await getContent(this.author.toLowerCase(), this.permlink)
    if (!this.post) this.notFound = true

    this.loading = false
  }
}
</script>

<style>
.post-in-modal {
  padding: 10px 50px;
}

.loading {
  min-height: 300px;
}
</style>
